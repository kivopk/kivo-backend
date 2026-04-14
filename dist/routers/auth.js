"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../utils/mailer");
const server_1 = require("@trpc/server");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
exports.authRouter = trpc_1.t.router({
    register: trpc_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        username: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const exists = await ctx.prisma.user.findUnique({ where: { email: input.email } });
        if (exists)
            throw new server_1.TRPCError({ code: 'CONFLICT', message: 'User already exists' });
        const hashedPassword = await bcrypt_1.default.hash(input.password, 10);
        const user = await ctx.prisma.user.create({
            data: {
                email: input.email,
                password: hashedPassword,
                username: input.username,
            },
        });
        return { success: true, user: { id: user.id, email: user.email } };
    }),
    login: trpc_1.publicProcedure
        .input(zod_1.z.object({ loginId: zod_1.z.string(), password: zod_1.z.string() }))
        .mutation(async ({ input, ctx }) => {
        const user = await ctx.prisma.user.findFirst({
            where: {
                OR: [
                    { email: input.loginId },
                    { username: input.loginId }
                ]
            }
        });
        if (!user)
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        const isValid = await bcrypt_1.default.compare(input.password, user.password);
        if (!isValid)
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        return { success: true, token, user: { id: user.id, email: user.email } };
    }),
    me: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        // Fetch full profile from DB
        const user = await ctx.prisma.user.findUnique({ where: { id: ctx.user.id } });
        if (!user)
            throw new server_1.TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        return { user: { id: user.id, email: user.email, username: user.username, phoneNumber: user.phoneNumber, address: user.address, isAdmin: user.isAdmin } };
    }),
    updateProfile: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        username: zod_1.z.string().optional(),
        phoneNumber: zod_1.z.string().optional(),
        address: zod_1.z.string().optional()
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
        }
        catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new server_1.TRPCError({ code: 'CONFLICT', message: 'This email is already in use by another account!' });
            }
            throw new server_1.TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update profile' });
        }
    }),
    forgotPassword: trpc_1.publicProcedure
        .input(zod_1.z.object({ email: zod_1.z.string().email(), resetUrlPrefix: zod_1.z.string().url() }))
        .mutation(async ({ input, ctx }) => {
        const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });
        if (!user) {
            // Soft success, don't leak user existence
            return { success: true, message: 'If email exists, a reset link was sent.' };
        }
        const resetToken = jsonwebtoken_1.default.sign({ userId: user.id, intent: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
        await ctx.prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
            },
        });
        const resetLink = `${input.resetUrlPrefix}?token=${resetToken}`;
        await (0, mailer_1.sendResetPasswordEmail)(user.email, resetLink);
        return { success: true, message: 'Reset email sent.' };
    }),
    resetPassword: trpc_1.publicProcedure
        .input(zod_1.z.object({ token: zod_1.z.string(), newPassword: zod_1.z.string().min(6) }))
        .mutation(async ({ input, ctx }) => {
        try {
            const decoded = jsonwebtoken_1.default.verify(input.token, JWT_SECRET);
            if (decoded.intent !== 'reset')
                throw new Error('Invalid token intent');
            const user = await ctx.prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user || user.resetToken !== input.token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
                throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
            }
            const hashedPassword = await bcrypt_1.default.hash(input.newPassword, 10);
            await ctx.prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });
            return { success: true, message: 'Password reset successfully' };
        }
        catch (err) {
            throw new server_1.TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
        }
    }),
});
//# sourceMappingURL=auth.js.map