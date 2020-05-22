import { Expense, User, PaymentOption } from "../redux/reducers";
import fetch from "node-fetch";
import * as gql from "gql-query-builder";

import { useSelector, useDispatch } from "react-redux";
import { parseISO, formatISO } from "date-fns";
// const testUser1: User = {
//   name: "Miki",
//   id: 1,
// };
// const testUser2: User = {
//   name: "Test",
//   id: 2,
// };

// const testCategories = [
//   {
//     name: "🍚 Groceries",
//     id: 1,
//   },
//   {
//     name: "🏠 Household Items/Supplies",
//     id: 2,
//   },
//   {
//     name: "🍴 Cafe/Restaurant/Bar",
//     id: 3,
//   },
//   {
//     name: "🎉 Entertainment",
//     id: 4,
//   },
//   {
//     name: "📕 Education",
//     id: 5,
//   },
//   {
//     name: "🚃 Travel",
//     id: 6,
//   },
//   {
//     name: "🍻 Relationship",
//     id: 7,
//   },
//   {
//     name: "👪 Other",
//     id: 8,
//   },
//   {
//     name: "🏥 Medical/Healthcare",
//     id: 9,
//   },
// ];
// const testPaymentOption1: PaymentOption = {
//   name: "💸 Cash",
//   id: 1,
// };
// const testExpenses: Expense[] = [
//   {
//     id: 1,
//     title: "test expense 1",
//     memo: "test memo 1",
//     amount: 100,
//     weightedAmount: 0,
//     paidBy: testUser1,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-02T00:00:00Z")),
//     createdBy: testUser1,
//     category: testCategories[0],
//   },
//   {
//     id: 2,
//     title: "test expense 2",
//     memo: "test memo 2",
//     amount: 140,
//     weightedAmount: 0,
//     paidBy: testUser1,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-03T00:00:00Z")),
//     createdBy: testUser1,
//     category: testCategories[2],
//   },
//   {
//     id: 3,
//     title: "test expense 3",
//     memo: "test memo 3",
//     amount: 240,
//     weightedAmount: -10,
//     paidBy: testUser2,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-01T00:00:00Z")),
//     createdBy: testUser1,
//     category: testCategories[0],
//   },
//   {
//     id: 4,
//     title: "test expense 4",
//     memo: "test memo 4",
//     amount: 110,
//     weightedAmount: 0,
//     paidBy: testUser1,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-02T04:00:00Z")),
//     createdBy: testUser1,
//     category: testCategories[4],
//   },
//   {
//     id: 5,
//     title: "test expense 5",
//     memo: "test memo 5",
//     amount: 200,
//     weightedAmount: 0,
//     paidBy: testUser1,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-01T00:00:00Z")),
//     createdBy: testUser1,
//     category: testCategories[0],
//   },
//   {
//     id: 6,
//     title: "test expense 6",
//     memo: "test memo 6",
//     amount: 200,
//     weightedAmount: 0,
//     paidBy: testUser2,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-01T00:00:00Z")),
//     createdBy: testUser2,
//     category: testCategories[6],
//   },
//   {
//     id: 7,
//     title: "test expense 7",
//     memo: "test memo 7",
//     amount: 200,
//     weightedAmount: 0,
//     paidBy: testUser2,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-01T00:00:00Z")),
//     createdBy: testUser1,
//     category: testCategories[8],
//   },
//   {
//     id: 8,
//     title: "test expense 8",
//     memo: "test memo 8",
//     amount: 200,
//     weightedAmount: 0,
//     paidBy: testUser2,
//     paymentOption: testPaymentOption1,
//     createdAt: formatISO(parseISO("2020-05-01T00:00:00Z")),
//     createdBy: testUser2,
//     category: testCategories[5],
//   },
// ];
const apiEndpoint =
  process.env.API_ENDPOINT ||
  "https://491qlrloe6.execute-api.us-east-1.amazonaws.com/dev/dev/graphql";
const testExpenses = [];
interface GraphqlInputExpense {
  title: string;
  memo?: { value: string; required: boolean };
  amount: number;
  weightedAmount?: { value: number; required: boolean };
  paidById: number;
  paymentOptionId: number;
  createdById: number;
  categoryId: number;
}
export const getSortedExpensesData = async () => {
  const res = await fetch(apiEndpoint, {
    method: "POST",
    // mode: "no-cors", //TODO I have to change server side
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query { Expenses 
      {
        id
        title
        memo
        amount
        weightedAmount
        paidBy{
          id
          name
        }
        paymentOption{
          id
          name
        }
        createdAt
        createdBy{
          id
          name
        }
        category{
          id
          name
        }
      }
    }`,
    }),
  });
  const result = await res.json();
  console.log("result :>> ", result);
  const allExpensesData: Expense[] = result.data.Expenses;
  console.log("allExpensesData :>> ", allExpensesData);
  // Sort posts by date
  return allExpensesData.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return -1;
    }
  });
};

export const addExpensesData = async (expense: GraphqlInputExpense) => {
  const query = gql.mutation({
    operation: "createExpense",
    variables: expense,
    fields: [
      "id",
      "title",
      "memo",
      "amount",
      "weightedAmount",
      { paidBy: ["id", "name"] },
      { paymentOption: ["id", "name"] },
      "createdAt",
      { createdBy: ["id", "name"] },
      {
        category: ["id", "name"],
      },
    ],
  });

  console.log(query);

  console.log("query :>> ", JSON.stringify(query));
  //TODO https://stackoverflow.com/questions/54589989/unexpected-end-of-json-on-graphql-query-with-react-while-no-issue-with-graphiql

  const res = await fetch(apiEndpoint, {
    method: "POST",
    mode: "no-cors", //TODO I have to change server side
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });
  console.log("res :>> ", res);
  // const result = await res.json();
  // return result.data.createExpense;
  //TODO
  // const result = await getSortedExpensesData();
  // console.log("result :>> ", result);
  return expense;
};

export const getAllExpenseIds = () => {
  return testExpenses.map(({ id }) => {
    return {
      params: {
        id: id.toString(),
      },
    };
  });
};

export const getExpenseData = async (expenseId: string) => {
  const res = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query{expense(where:{id:${expenseId}}){
    {
      id
      title
      memo
      amount
      weightedAmount
      paidBy{
        id
        name
      }
      paymentOption{
        id
        name
      }
      createdAt
      createdBy{
        id
        name
      }
      category{
        id
        name
      }
    }
  }`,
    }),
  });
  const result = await res.json();
  console.log("result :>> ", result);
  return result.data;
};
