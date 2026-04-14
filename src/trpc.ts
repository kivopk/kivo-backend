import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const prisma = new PrismaClient();

// Create truthy context
export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (token) {
        try {
          const jwtSecret = process.env.JWT_SECRET || 'supersecret';
          const decoded = jwt.verify(token, jwtSecret) as { userId: number };
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
          });
          return user;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }
  const user = await getUserFromHeader();
  return {
    prisma,
    user,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({
    ctx: {
      user: opts.ctx.user,
    },
  });
});
