"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.t = exports.createContext = exports.prisma = void 0;
const server_1 = require("@trpc/server");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.prisma = new client_1.PrismaClient();
// Create truthy context
const createContext = async ({ req, res }) => {
    async function getUserFromHeader() {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (token) {
                try {
                    const jwtSecret = process.env.JWT_SECRET || 'supersecret';
                    const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                    const user = await exports.prisma.user.findUnique({
                        where: { id: decoded.userId },
                    });
                    return user;
                }
                catch (e) {
                    return null;
                }
            }
        }
        return null;
    }
    const user = await getUserFromHeader();
    return {
        prisma: exports.prisma,
        user,
    };
};
exports.createContext = createContext;
exports.t = server_1.initTRPC.context().create();
exports.publicProcedure = exports.t.procedure;
exports.protectedProcedure = exports.t.procedure.use((opts) => {
    if (!opts.ctx.user) {
        throw new server_1.TRPCError({ code: 'UNAUTHORIZED' });
    }
    return opts.next({
        ctx: {
            user: opts.ctx.user,
        },
    });
});
//# sourceMappingURL=trpc.js.map