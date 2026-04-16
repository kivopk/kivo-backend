import { t, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '../utils/mailer';
import { TRPCError } from '@trpc/server';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const authRouter = t.router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      username: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const exists = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (exists) throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          username: input.username,
        },
      });
      return { success: true, user: { id: user.id, email: user.email } };
    }),

  login: publicProcedure
    .input(z.object({ loginId: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          OR: [
            { email: input.loginId },
            { username: input.loginId }
          ]
        }
      });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

      let isValid = false;

      // Check if password is mathematically a legacy Django PBKDF2 hash
      if (user.password.startsWith('pbkdf2_sha256$')) {
        const parts = user.password.split('$');
        if (parts.length === 4) {
          const iterations = parseInt(parts[1], 10);
          const salt = parts[2];
          const hash = parts[3];
          const key = crypto.pbkdf2Sync(input.password, salt, iterations, 32, 'sha256');
          isValid = key.toString('base64') === hash;

          if (isValid) {
            // Seamlessly upgrade to bcrypt for future logins
            const newHashedPassword = await bcrypt.hash(input.password, 10);
            await ctx.prisma.user.update({
              where: { id: user.id },
              data: { password: newHashedPassword }
            });
          }
        }
      } else {
        isValid = await bcrypt.compare(input.password, user.password);
      }

      if (!isValid) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { success: true, token, user: { id: user.id, email: user.email } };
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    // Fetch full profile from DB
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.user.id } });
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    return { user: { id: user.id, email: user.email, username: user.username, phoneNumber: user.phoneNumber, address: user.address, isAdmin: user.isAdmin } };
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      email: z.string().email().optional(),
      username: z.string().optional(),
      phoneNumber: z.string().optional(),
      address: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            email: input.email,
            username: input.username,
            phoneNumber: input.phoneNumber,
            address: input.address,
          }
        });
        return { success: true, user: { id: user.id, email: user.email, username: user.username } };
      } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
          throw new TRPCError({ code: 'CONFLICT', message: 'This email is already in use by another account!' });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update profile' });
      }
    }),

  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email(), resetUrlPrefix: z.string().url() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (!user) {
        // Soft success, don't leak user existence
        return { success: true, message: 'If email exists, a reset link was sent.' };
      }

      const resetToken = jwt.sign({ userId: user.id, intent: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
      
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        },
      });

      const resetLink = `${input.resetUrlPrefix}?token=${resetToken}`;
      await sendResetPasswordEmail(user.email, resetLink);
      
      return { success: true, message: 'Reset email sent.' };
    }),

  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), newPassword: z.string().min(6) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const decoded = jwt.verify(input.token, JWT_SECRET) as { userId: number, intent: string };
        if (decoded.intent !== 'reset') throw new Error('Invalid token intent');

        const user = await ctx.prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || user.resetToken !== input.token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(input.newPassword, 10);
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        });

        return { success: true, message: 'Password reset successfully' };
      } catch (err) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
      }
    }),
});
