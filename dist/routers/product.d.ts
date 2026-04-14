export declare const productRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            search?: string | undefined;
            minPrice?: number | undefined;
            maxPrice?: number | undefined;
            sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | undefined;
            take?: number | undefined;
            skip?: number | undefined;
        } | undefined;
        output: ({
            category: {
                id: number;
                name: string;
                slug: string;
            };
        } & {
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
        })[];
        meta: object;
    }>;
    getById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: number;
        };
        output: ({
            category: {
                id: number;
                name: string;
                slug: string;
            };
        } & {
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
        }) | null;
        meta: object;
    }>;
}>>;
//# sourceMappingURL=product.d.ts.map