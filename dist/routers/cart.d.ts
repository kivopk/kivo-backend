export declare const cartRouter: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        prisma: import(".prisma/client").PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
        user: {
            id: number;
            email: string;
            username: string | null;
            password: string;
            phoneNumber: string | null;
            address: string | null;
            resetToken: string | null;
            resetTokenExpiry: Date | null;
            isAdmin: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getCart: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            items: ({
                product: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    slug: string;
                    price: number;
                    image: string | null;
                    stock: number;
                    categoryId: number;
                };
            } & {
                id: number;
                productId: number;
                quantity: number;
                cartId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
        };
        meta: object;
    }>;
    addToCart: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productId: number;
            quantity?: number | undefined;
        };
        output: {
            id: number;
            productId: number;
            quantity: number;
            cartId: number;
        };
        meta: object;
    }>;
    checkout: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            fullName: string;
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        output: {
            success: boolean;
            orderId: number;
        };
        meta: object;
    }>;
}>>;
//# sourceMappingURL=cart.d.ts.map