"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
exports.cartRouter = trpc_1.t.router({
    getCart: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        let cart = await ctx.prisma.cart.findUnique({
            where: { userId: ctx.user.id },
            include: {
                items: { include: { product: true } }
            }
        });
        if (!cart) {
            cart = await ctx.prisma.cart.create({
                data: { userId: ctx.user.id },
                include: { items: { include: { product: true } } }
            });
        }
        return cart;
    }),
    addToCart: trpc_1.protectedProcedure
        .input(zod_1.z.object({ productId: zod_1.z.number(), quantity: zod_1.z.number().min(1).default(1) }))
        .mutation(async ({ input, ctx }) => {
        let cart = await ctx.prisma.cart.findUnique({ where: { userId: ctx.user.id } });
        if (!cart) {
            cart = await ctx.prisma.cart.create({ data: { userId: ctx.user.id } });
        }
        const existingItem = await ctx.prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId: input.productId }
        });
        if (existingItem) {
            return await ctx.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + input.quantity }
            });
        }
        return await ctx.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: input.productId,
                quantity: input.quantity
            }
        });
    }),
    checkout: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        fullName: zod_1.z.string(),
        address: zod_1.z.string(),
        city: zod_1.z.string(),
        postalCode: zod_1.z.string(),
        country: zod_1.z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        const cart = await ctx.prisma.cart.findUnique({
            where: { userId: ctx.user.id },
            include: { items: { include: { product: true } } }
        });
        if (!cart || cart.items.length === 0) {
            throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: 'Cart is empty' });
        }
        let totalPrice = 0;
        for (const item of cart.items) {
            totalPrice += item.quantity * item.product.price;
            if (item.product.stock < item.quantity) {
                throw new server_1.TRPCError({ code: 'BAD_REQUEST', message: `Not enough stock for ${item.product.name}` });
            }
        }
        // Create Order in a transaction
        const order = await ctx.prisma.$transaction(async (prisma) => {
            const newOrder = await prisma.order.create({
                data: {
                    userId: ctx.user.id,
                    fullName: input.fullName,
                    address: input.address,
                    city: input.city,
                    postalCode: input.postalCode,
                    country: input.country,
                    totalPrice,
                    status: 'Pending',
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            price: item.product.price,
                            quantity: item.quantity
                        }))
                    }
                }
            });
            // Deduct stock
            for (const item of cart.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            // Empty cart
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            return newOrder;
        });
        return { success: true, orderId: order.id };
    }),
});
//# sourceMappingURL=cart.js.map