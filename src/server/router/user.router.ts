// backend/routers/userRouter.ts

import { z } from "zod";
import { createRouter } from "./context";

export const userRouter = createRouter()
  .mutation("set-user", {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.user.update({
        where: {
          email: input.email,
        },
        data: {},
      });

      return { success: true, message: "Username set successfully" };
    },
  })
  .query("get-user", {
    input: z.object({
      email: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      return { success: true, user };
    },
  });
