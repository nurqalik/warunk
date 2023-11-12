import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import type { Product } from "@prisma/client";

export const productRouter = createTRPCRouter({
  getAll: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.product.findMany({
      where: {
        createdById: input,
      },
      include: {
        category: true,
        createdBy: true,
      },
    });
  }),
  getOne: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const product = await ctx.db.product.findUnique({
      where: {
        id: input,
      },
      include: {
        category: true,
        createdBy: true,
      },
    });
    return product;
  }),
  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        img: z.string(),
        price: z.number(),
        stock: z.number(),
        categoryId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          img: input.img,
          price: input.price,
          stock: input.stock,
          categoryId: input.categoryId,
          createdById: ctx.session.user.id,
        },
      });
    }),
  updateProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        img: z.string(),
        price: z.number(),
        stock: z.number(),
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let product: Product | null;
      if (input.id) {
        product = await ctx.db.product.findUnique({
          where: {
            id: input.id,
          },
        });
        if (product) {
          product = await ctx.db.product.update({
            data: {
              name: input.name,
              img: input.img,
              price: input.price,
              stock: input.stock,
              categoryId: input.categoryId,
            },
            where: {
              id: product.id,
            },
          });
        }
        return product;
      }
    }),
  deleteProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
