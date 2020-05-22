//TODO convert to ES6
import { objectType, makeSchema, stringArg, intArg } from "@nexus/schema";
import { nexusPrismaPlugin } from "nexus-prisma";

//https://www.nexusjs.org/#/components/schema/plugins/prisma

const Expense = objectType({
  name: "Expense",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.memo();
    t.model.amount();
    t.model.weightedAmount();
    t.model.paidBy();
    t.model.category();
    t.model.paymentOption();
    t.model.category();
    t.model.createdAt();
    t.model.createdBy();
  },
});
const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
  },
});
const Category = objectType({
  name: "Category",
  definition(t) {
    t.model.id();
    t.model.name();
  },
});
const PaymentOption = objectType({
  name: "PaymentOption",
  definition(t) {
    t.model.id();
    t.model.name();
  },
});
const Query = objectType({
  name: "Query",
  definition(t) {
    t.crud.expense({
      ordering: true,
      filtering: true,
    });
    t.list.field("Expenses", {
      type: "Expense",
      resolve(_, args, ctx) {
        return ctx.prisma.expense.findMany({
          include: {
            paidBy: true,
            createdBy: true,
            category: true,
            paymentOption: true,
          },
        });
      },
    });
    t.list.field("filterExpenses", {
      type: "Expense",
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve(_, args, ctx) {
        const searchString = args.searchString;
        return ctx.prisma.expense.findMany({
          include: {
            paidBy: true,
            createdBy: true,
            category: true,
            paymentOption: true,
          },
          where: {
            OR: [
              { title: { contains: searchString } },
              { memo: { contains: searchString } },
            ],
          },
        });
      },
    });
    t.crud.user();
    t.crud.users({
      ordering: true,
    });
    t.list.field("filterUsers", {
      type: "User",
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve(_, { searchString }, ctx) {
        return ctx.prisma.user.findMany({
          where: { name: { contains: searchString } },
        });
      },
    });
    t.crud.category();
    t.crud.categories({ ordering: true });
    t.crud.paymentOption();
    t.crud.paymentOptions({ ordering: true });
  },
});
const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createExpense", {
      type: "Expense",
      args: {
        title: stringArg(),
        memo: stringArg({ nullable: false }),
        amount: intArg(),
        weightedAmount: intArg({ nullable: false }),
        paidById: intArg(),
        categoryId: intArg(),
        paymentOptionId: intArg(),
        createdById: intArg(),
      },
      resolve(
        _,
        {
          title,
          memo,
          amount,
          weightedAmount,
          paidById,
          categoryId,
          paymentOptionId,
          createdById,
        },
        ctx
      ) {
        return ctx.prisma.expense.create({
          data: {
            title: title,
            memo: memo,
            amount: amount,
            weightedAmount: weightedAmount,
            paidBy: {
              connect: { id: paidById },
            },
            category: {
              connect: { id: categoryId },
            },
            paymentOption: {
              connect: { id: paymentOptionId },
            },
            createdBy: {
              connect: { id: createdById },
            },
          },
        });
      },
    });
    t.field("updateExpense", {
      type: "Expense",
      args: {
        id: intArg(),
        title: stringArg({ nullable: false }),
        memo: stringArg({ nullable: false }),
        amount: intArg({ nullable: false }),
        weightedAmount: intArg({ nullable: false }),
        paidById: intArg(),
        categoryId: intArg(),
        paymentOptionId: intArg(),
        createdById: intArg(),
      },
      resolve(
        _,
        {
          id,
          title,
          memo,
          amount,
          weightedAmount,
          paidById,
          categoryId,
          paymentOptionId,
          createdById,
        },
        ctx
      ) {
        return ctx.prisma.expense.update({
          where: { id },
          data: {
            title: title,
            memo: memo,
            amount: amount,
            weightedAmount: weightedAmount,
            paidBy: {
              connect: { id: paidById },
            },
            category: {
              connect: { id: categoryId },
            },
            paymentOption: {
              connect: { id: paymentOptionId },
            },
            createdBy: {
              connect: { id: createdById },
            },
          },
        });
      },
    });

    t.field("createUser", {
      type: "User",
      args: {
        name: stringArg({ nullable: false }),
      },
      resolve(_, { name }, ctx) {
        return ctx.prisma.user.create({
          data: {
            name: name,
          },
        });
      },
    });
    t.field("createCategory", {
      type: "Category",
      args: {
        name: stringArg({ nullable: false }),
      },
      resolve(_, { name }, ctx) {
        return ctx.prisma.category.create({
          data: {
            name: name,
          },
        });
      },
    });
    t.field("createPaymentOption", {
      type: "PaymentOption",
      args: {
        name: stringArg({ nullable: false }),
      },
      resolve(_, { name }, ctx) {
        return ctx.prisma.paymentOption.create({
          data: {
            name: name,
          },
        });
      },
    });
  },
});

console.log("process.env.NODE_ENV :>> ", process.env.NODE_ENV);
export const schema = makeSchema({
  types: [Query, Mutation, Expense, User, Category, PaymentOption],
  //To create output
  shouldGenerateArtifacts: process.env.NODE_ENV === "local",
  plugins: [
    nexusPrismaPlugin({
      shouldGenerateArtifacts: process.env.NODE_ENV === "local",
    }),
  ],
  outputs: {
    schema: __dirname + "/../generated/schema.graphql",
    typegen:
      __dirname + "/../node_modules/@types/nexus-prisma-typegen/index.d.ts",
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});
