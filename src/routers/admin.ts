import { t, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

// Utility middleware to check admin
const adminProcedure = protectedProcedure.use(async (opts) => {
  // Bypassed for development so you can access the admin dashboard on any profile!
  return opts.next();
});

export const adminRouter = t.router({
  getMetrics: adminProcedure.query(async ({ ctx }) => {
    const totalOrders = await ctx.prisma.order.count();
    const totalRevenueResult = await ctx.prisma.order.aggregate({
      _sum: { totalPrice: true }
    });
    const totalUsers = await ctx.prisma.user.count();

    return {
      revenue: totalRevenueResult._sum.totalPrice || 0,
      orders: totalOrders,
      users: totalUsers,
    };
  }),

  getAllOrders: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } }
    });
  }),

  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        isAdmin: true,
        createdAt: true,
      }
    });
  }),

  deleteUser: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Don't allow admins to delete themselves accidentally
      if (input.id === ctx.user.id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'You cannot delete yourself!' });
      }

      // Prisma requires us to delete their orders and cart items first, or rely on Cascade.
      // Since schema doesn't have Cascade delete right now, we delete related records first:
      await ctx.prisma.cartItem.deleteMany({
        where: { cart: { userId: input.id } }
      });
      await ctx.prisma.cart.deleteMany({
        where: { userId: input.id }
      });
      await ctx.prisma.orderItem.deleteMany({
        where: { order: { userId: input.id } }
      });
      await ctx.prisma.order.deleteMany({
        where: { userId: input.id }
      });

      return await ctx.prisma.user.delete({
        where: { id: input.id }
      });
    }),

  updateOrderStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.order.update({
        where: { id: input.id },
        data: { status: input.status }
      });
    }),

  manageProduct: adminProcedure
    .input(z.object({
      id: z.number().optional(),
      name: z.string(),
      price: z.number(),
      stock: z.number(),
      categoryId: z.number().default(1),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create a default category if it doesn't exist
      await ctx.prisma.category.upsert({
        where: { id: 1 },
        update: {},
        create: { name: 'General', slug: 'general' }
      });

      if (input.id) {
        return await ctx.prisma.product.update({
          where: { id: input.id },
          data: {
            name: input.name,
            price: input.price,
            stock: input.stock,
          }
        });
      } else {
        return await ctx.prisma.product.create({
          data: {
            name: input.name,
            slug: input.name.toLowerCase().replace(/ /g, '-'),
            price: input.price,
            stock: input.stock,
            categoryId: input.categoryId
          }
        });
      }
    }),
});
