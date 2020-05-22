import Head from "next/head";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { State } from "../redux/reducers";
import {
  setNextMonthData,
  setPreviousMonthData,
  addExpense,
} from "../redux/actions";
import { wrapper } from "../redux/store";
import { RadialChart } from "react-vis";

import { getSortedExpensesData } from "../lib/expenses";
import { getSortedUsersData } from "../lib/users";
import { getSortedCategoriesData } from "../lib/categories";

import Layout from "../components/layout";
import { TopDisplayDate } from "../components/display-date";

import { isThisMonth, parseISO } from "date-fns";
import { Flex, Box, Text, Button, Heading } from "rebass";
import { Spinner } from "theme-ui";
import ExpensePerPerson from "../components/expenses/expense-per-person";
import ExpensePerCategory from "../components/expenses/expense-per-category";
import ExpenseSummary from "../components/expenses/expense-summary";
import { Expense, User, Category } from "../redux/reducers";

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store }) => {
    const allUsersData = await getSortedUsersData();
    const allCategoriesData = await getSortedCategoriesData();
    const allExpensesData = await getSortedExpensesData();
    allExpensesData.forEach((expense) => {
      console.log("***expense :>> ", expense);
      store.dispatch(addExpense(expense));
    });
    return {
      props: {
        allUsersData,
        allCategoriesData,
      },
    };
  }
);

export default function Home({
  allUsersData,
  allCategoriesData,
}: {
  allUsersData: User[];
  allCategoriesData: Category[];
}) {
  const dispatch = useDispatch();

  const currentDisplayedDate: string = useSelector((state: State) => {
    console.log("**state :>> ", state);
    return state.currentDisplayedDate;
  });

  const currentDisplayedExpenses: Expense[] = useSelector(
    (state: State) => state.currentDisplayedExpenses
  );

  const changeNextMonth = () => {
    dispatch(setNextMonthData());
  };

  const changePreviousMonth = () => {
    dispatch(setPreviousMonthData());
  };
  return (
    <Layout home={true}>
      <Head>
        <title>Share Expenses app</title>
      </Head>
      <Flex mx={2}>
        <Link href="/submit-form">
          <Button variant="primary" mr={2}>
            Input new expense
          </Button>
        </Link>
      </Flex>
      <Flex mx={2}>
        <Box width={1 / 3}>
          <Button onClick={changePreviousMonth}>◀︎</Button>
        </Box>
        <Box width={1 / 3}>
          <TopDisplayDate dateString={currentDisplayedDate} />
        </Box>
        <Box width={1 / 3}>
          <Button
            onClick={changeNextMonth}
            disabled={isThisMonth(parseISO(currentDisplayedDate))}
          >
            ▶︎
          </Button>
        </Box>
      </Flex>
      {!currentDisplayedExpenses || !allCategoriesData || !allUsersData ? (
        <Spinner />
      ) : (
        <Box>
          <Box>
            <Heading>Payment</Heading>
            <Box>
              <Text>Total expense</Text>
              <Flex mx={2}>
                <Text>
                  ¥
                  {currentDisplayedExpenses.reduce(
                    (sum, expense) => sum + expense.amount,
                    0
                  )}
                </Text>
              </Flex>
            </Box>

            <Text>Shared Total expense</Text>
            <Flex mx={2}>
              {allUsersData.map(({ id, name }) => (
                <ExpensePerPerson
                  key={id}
                  userName={name}
                  userId={id}
                  allExpensesData={currentDisplayedExpenses}
                  size={allUsersData.length + 1}
                />
              ))}
            </Flex>
          </Box>
          <Box>
            {currentDisplayedExpenses.length !== 0 ? (
              <RadialChart
                data={allCategoriesData
                  .map(({ id, name }) => ({
                    angle: currentDisplayedExpenses
                      .filter((expense) => expense.category.id === id)
                      .reduce((sum, expense) => sum + expense.amount, 0),
                    label: name,
                  }))
                  .filter((x) => x.angle !== 0)}
                labelsRadiusMultiplier={0.8}
                labelsStyle={{ fontSize: 9, fill: "#111" }}
                showLabels={true}
                width={400}
                height={400}
                innerRadius={10}
                radius={150}
                padAngle={0.03}
              />
            ) : (
              <></>
            )}
          </Box>
          <Box>
            <Heading>Expense</Heading>
            <Text>Summary</Text>

            <Flex mx={2}>
              <Text width={1 / 3}>Category Name</Text>
              <Text width={1 / 3}>Amount(¥)</Text>
              <Text width={1 / 3}>Proportion(%)</Text>
            </Flex>
            {allCategoriesData.map(({ id, name }) => (
              <ExpensePerCategory
                key={id}
                categoryName={name}
                categoryId={id}
                allExpensesData={currentDisplayedExpenses}
              />
            ))}
          </Box>

          <Box>
            <Text>All Expense detail</Text>
            <Flex mx={2}>
              <Text width={1 / 3}>Title</Text>
              <Text width={1 / 3}>Memo</Text>
              <Text width={1 / 3}>Date</Text>
            </Flex>
            {currentDisplayedExpenses.map((expense) => {
              return <ExpenseSummary key={expense.id} dateExpense={expense} />;
            })}
          </Box>
        </Box>
      )}
    </Layout>
  );
}
