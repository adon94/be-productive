import * as trpc from "@trpc/server";
import z from "zod";
import { createRouter } from "./context";

export const journalEntryRouter = createRouter()
  .mutation("create-journal-entry", {
    input: z.object({
      content: z.string().min(10),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session || !ctx.session.user) {
        throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
      }
      const entry = await ctx.prisma.journalEntry.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return entry;
    },
  })
  .mutation("update-journal-entry", {
    input: z.object({
      content: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session || !ctx.session.user) {
        throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
      }
      const entry = await ctx.prisma.journalEntry.update({
        where: {
          id: input?.id,
        },
        data: {
          ...input,
        },
      });

      return entry;
    },
  })
  .query("journal-entries", {
    resolve({ ctx }) {
      return ctx.prisma.journalEntry.findMany();
    },
  })
  .query("single-journal-entry", {
    input: z.object({
      journalEntryId: z.string(),
    }),
    resolve({ input, ctx }) {
      return ctx.prisma.journalEntry.findUnique({
        where: {
          id: input?.journalEntryId,
        },
      });
    },
  });
