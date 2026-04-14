import express from "express";
import cors from "cors";
import "dotenv/config";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc";
import { t } from "./trpc";

// Import Routers
import { authRouter } from "./routers/auth";
import { productRouter } from "./routers/product";
import { cartRouter } from "./routers/cart";

import { adminRouter } from "./routers/admin";

// Root Router
const appRouter = t.router({
  auth: authRouter,
  product: productRouter,
  cart: cartRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Kivo Backend is Successfully Running!</h1><p>API is listening at /trpc</p>");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
