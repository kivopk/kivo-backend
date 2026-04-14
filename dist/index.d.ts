import "dotenv/config";
declare const appRouter: import("@trpc/server").TRPCBuiltRouter<{
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
    auth: import("@trpc/server").TRPCBuiltRouter<{
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
        register: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                password: string;
                username?: string | undefined;
            };
            output: {
                success: boolean;
                user: {
                    id: number;
                    email: string;
                };
            };
            meta: object;
        }>;
        login: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                loginId: string;
                password: string;
            };
            output: {
                success: boolean;
                token: string;
                user: {
                    id: number;
                    email: string;
                };
            };
            meta: object;
        }>;
        me: import("@trpc/server").TRPCQueryProcedure<{
            input: void;
            output: {
                user: {
                    id: number;
                    email: string;
                    username: string | null;
                    phoneNumber: string | null;
                    address: string | null;
                    isAdmin: boolean;
                };
            };
            meta: object;
        }>;
        updateProfile: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email?: string | undefined;
                username?: string | undefined;
                phoneNumber?: string | undefined;
                address?: string | undefined;
            };
            output: {
                success: boolean;
                user: {
                    id: number;
                    email: string;
                    username: string | null;
                };
            };
            meta: object;
        }>;
        forgotPassword: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                email: string;
                resetUrlPrefix: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
        resetPassword: import("@trpc/server").TRPCMutationProcedure<{
            input: {
                token: string;
                newPassword: string;
            };
            output: {
                success: boolean;
                message: string;
            };
            meta: object;
        }>;
    }>>;
    product: import("@trpc/server").TRPCBuiltRouter<{
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
    cart: import("@trpc/server").TRPCBuiltRouter<{
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
    admin: import("@trpc/server").TRPCBuiltRouter<{
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
}>>;
export type AppRouter = typeof appRouter;
export {};
//# sourceMappingURL=index.d.ts.map