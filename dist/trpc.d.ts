import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const createContext: ({ req, res }: CreateExpressContextOptions) => Promise<{
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
}>;
export type Context = Awaited<ReturnType<typeof createContext>>;
export declare const t: import("@trpc/server").TRPCRootObject<{
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
}, object, import("@trpc/server").TRPCRuntimeConfigOptions<{
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
}, object>, {
    ctx: {
        prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
}>;
export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<{
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
}, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<{
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
}, object, {
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
    };
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map