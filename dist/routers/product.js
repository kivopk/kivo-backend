"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
exports.productRouter = trpc_1.t.router({
    list: trpc_1.publicProcedure
        .input(zod_1.z.object({
        search: zod_1.z.string().optional(),
        minPrice: zod_1.z.number().optional(),
        maxPrice: zod_1.z.number().optional(),
        sortBy: zod_1.z.enum(['newest', 'oldest', 'price_asc', 'price_desc']).optional(),
        take: zod_1.z.number().default(20),
        skip: zod_1.z.number().default(0),
    }).optional())
        .query(async ({ input, ctx }) => {
        const where = {};
        if (input?.search) {
            where.name = { contains: input.search }; // using primitive SQLite features; actual DB like Postgres could use search vector
        }
        if (input?.minPrice !== undefined || input?.maxPrice !== undefined) {
            where.price = {};
            if (input.minPrice !== undefined)
                where.price.gte = input.minPrice;
            if (input.maxPrice !== undefined)
                where.price.lte = input.maxPrice;
        }
        let orderBy = { createdAt: 'desc' }; // Default is newest
        if (input?.sortBy) {
            switch (input.sortBy) {
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case 'newest':
                    orderBy = { createdAt: 'desc' };
                    break;
                case 'price_asc':
                    orderBy = { price: 'asc' };
                    break;
                case 'price_desc':
                    orderBy = { price: 'desc' };
                    break;
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
    getById: trpc_1.publicProcedure
        .input(zod_1.z.object({ id: zod_1.z.number() }))
        .query(async ({ input, ctx }) => {
        const product = await ctx.prisma.product.findUnique({
            where: { id: input.id },
            include: { category: true }
        });
        return product;
    })
});
//# sourceMappingURL=product.js.map