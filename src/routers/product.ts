import { t, publicProcedure } from '../trpc';
import { z } from 'zod';

export const productRouter = t.router({
  list: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sortBy: z.enum(['newest', 'oldest', 'price_asc', 'price_desc']).optional(),
      take: z.number().default(20),
      skip: z.number().default(0),
    }).optional())
    .query(async ({ input, ctx }) => {
      const where: any = {};
      
      if (input?.search) {
        where.name = { contains: input.search }; // using primitive SQLite features; actual DB like Postgres could use search vector
      }
      if (input?.minPrice !== undefined || input?.maxPrice !== undefined) {
        where.price = {};
        if (input.minPrice !== undefined) where.price.gte = input.minPrice;
        if (input.maxPrice !== undefined) where.price.lte = input.maxPrice;
      }

      let orderBy: any = { createdAt: 'desc' }; // Default is newest
      if (input?.sortBy) {
        switch (input.sortBy) {
          case 'oldest': orderBy = { createdAt: 'asc' }; break;
          case 'newest': orderBy = { createdAt: 'desc' }; break;
          case 'price_asc': orderBy = { price: 'asc' }; break;
          case 'price_desc': orderBy = { price: 'desc' }; break;
        }
      }

      const products = await ctx.prisma.product.findMany({
        where,
        orderBy,
        take: input?.take,
        skip: input?.skip,
        include: { category: true }
      });
      return products;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: { category: true }
      });
      return product;
    })
});
