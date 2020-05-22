import {
  PrismaClient,
  UserCreateInput,
  PaymentOptionCreateInput,
  CategoryCreateInput,
  ExpenseCreateInput,
} from "@prisma/client";

const prisma = new PrismaClient();
require("dotenv").load();

const local = process.env.NODE_ENV === "local";

const seedUsers: UserCreateInput[] = [{ name: "Miki" }, { name: "test" }];
// 💸 Cash
// 💳 Cashless"
const seedPaymentOptions: PaymentOptionCreateInput[] = [
  { name: "💸 Cash" },
  { name: "💳 Cashless" },
];

// 🍚 Groceries
// 🍴 Cafe/Restaurant/Bar
// 🏠 Household Items/Supplies
// 🍻 Relationship
// 🎉 Entertainment
// 📕 Education
// 🚃 Travel
// 🏥 Medical/Healthcare
// 👪 Other
const seedCategories: CategoryCreateInput[] = [
  { name: "🍚 Groceries" },
  { name: "🍴 Cafe/Restaurant/Bar" },
  { name: "🏠 Household Items/Supplies" },
  { name: "🍻 Relationship" },
  { name: "🎉 Entertainment" },
  { name: "📕 Education" },
  { name: "🚃 Travel" },
  { name: "🏥 Medical/Healthcare" },
  { name: "👪 Other" },
];

// {
//   "data": {
//     "users": [
//       {
//         "name": "Miki",
//         "id": 1
//       },
//       {
//         "name": "test",
//         "id": 2
//       }
//     ]
//   }
// }
// {
//   "data": {
//     "paymentOptions": [
//       {
//         "name": "💸 Cash",
//         "id": 1
//       },
//       {
//         "name": "💳 Cashless",
//         "id": 2
//       }
//     ]
//   }
// }
// {
//   "data": {
//     "categories": [
//       {
//         "name": "🍚 Groceries",
//         "id": 1
//       },
//       {
//         "name": "🏠 Household Items/Supplies",
//         "id": 2
//       },
//       {
//         "name": "🍴 Cafe/Restaurant/Bar",
//         "id": 3
//       },
//       {
//         "name": "🎉 Entertainment",
//         "id": 4
//       },
//       {
//         "name": "📕 Education",
//         "id": 5
//       },
//       {
//         "name": "🚃 Travel",
//         "id": 6
//       },
//       {
//         "name": "🍻 Relationship",
//         "id": 7
//       },
//       {
//         "name": "👪 Other",
//         "id": 8
//       },
//       {
//         "name": "🏥 Medical/Healthcare",
//         "id": 9
//       }
//     ]
//   }
// }

const seedExpenses: ExpenseCreateInput[] = [
  {
    id: 1,
    title: "test expense 1",
    memo: "test memo 1",
    amount: 100,
    weightedAmount: 0,
    paidBy: {
      name: "Miki",
      id: 1,
    },
    categoryId: 2,
    paymentOption: {
      name: "💸 Cash",
      id: 1,
    },
    createdAt: "2020-05-02T00:00:00Z",
    createdBy: {
      name: "Miki",
      id: 1,
    },
    category: {
      name: "🍚 Groceries",
      id: 1,
    },
  },
  {
    id: 2,
    title: "test expense 2",
    memo: "test memo 2",
    amount: 140,
    weightedAmount: 0,
    paidBy: {
      name: "Miki",
      id: 1,
    },
    categoryId: 2,
    paymentOption: {
      name: "💸 Cash",
      id: 1,
    },
    createdAt: "2020-05-02T00:00:00Z",
    createdBy: {
      name: "Miki",
      id: 1,
    },
    category: {
      name: "🍚 Groceries",
      id: 1,
    },
  },
];
exports.handler = async () => {
  try {
    await Promise.all([
      prisma.user.deleteMany({}),
      prisma.paymentOption.deleteMany({}),
      prisma.category.deleteMany({}),
    ]);

    const createdUsers: any[] = [];
    const createdPaymentOptions: any[] = [];
    const createdCategories: any[] = [];

    seedUsers.forEach(async (seedUser) => {
      createdUsers.push(
        await prisma.user.create({
          data: seedUser,
        })
      );
    });
    seedPaymentOptions.forEach(async (seedPaymentOption) => {
      createdPaymentOptions.push(
        await prisma.paymentOption.create({
          data: seedPaymentOption,
        })
      );
    });
    seedCategories.forEach(async (seedCategory) => {
      createdCategories.push(
        await prisma.category.create({
          data: seedCategory,
        })
      );
    });

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        [...createdUsers],
        [...createdPaymentOptions],
        [...createdCategories],
      ]),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500 };
  }
};

if (local) {
  exports.handler();
}
