import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ctx}) => {
    return ctx.db.category.findMany()
  }),
  getOne: protectedProcedure.input(z.string()).query( async({ctx, input}) => {
    const category = await ctx.db.category.findUnique({
      where: {
        id: input
      }
    })
    return category
  }),
})