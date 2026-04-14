export declare const authRouter: import("@trpc/server").TRPCBuiltRouter<{
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
//# sourceMappingURL=auth.d.ts.map