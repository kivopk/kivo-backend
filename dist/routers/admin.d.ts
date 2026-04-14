export declare const adminRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    getMetrics: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            revenue: number;
            orders: number;
            users: number;
        };
        meta: object;
    }>;
    getAllOrders: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: ({
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
                price: number;
                productId: number;
                quantity: number;
                orderId: number;
            })[];
        } & {
            id: number;
            address: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            fullName: string;
            city: string;
            postalCode: string;
            country: string;
            totalPrice: number;
            status: string;
        })[];
        meta: object;
    }>;
    getAllUsers: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: number;
            email: string;
            username: string | null;
            isAdmin: boolean;
            createdAt: Date;
        }[];
        meta: object;
    }>;
    deleteUser: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
        };
        output: {
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
        };
        meta: object;
    }>;
    updateOrderStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
            status: string;
        };
        output: {
            id: number;
            address: string;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            fullName: string;
            city: string;
            postalCode: string;
            country: string;
            totalPrice: number;
            status: string;
        };
        meta: object;
    }>;
    manageProduct: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            price: number;
            stock: number;
            id?: number | undefined;
            categoryId?: number | undefined;
        };
        output: {
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
        meta: object;
    }>;
}>>;
//# sourceMappingURL=admin.d.ts.map