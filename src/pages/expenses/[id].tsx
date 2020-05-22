import Head from "next/head";
import Layout from "../../components/layout";
import { NormalDate } from "../../components/display-date";

import { Box, Card, Heading, Text } from "rebass";
import { getAllExpenseIds, getExpenseData } from "../../lib/expenses";
import { Expense } from "../../redux/reducers";

export default function ExpenseDetail(expenseData: Expense) {
  console.log("expenseData :>> ", expenseData);
  return (
    <Layout home={false}>
      {" "}
      <Head>
        <title>{expenseData.title}</title>
      </Head>
      <Box>
        <Heading as="h1">{expenseData.title}</Heading>
        <Box>
          <NormalDate dateString={expenseData.createdAt} />
        </Box>
        <Text>{expenseData.memo}</Text>
      </Box>
    </Layout>
  );
}
export const getStaticPaths = async () => {
  // Return a list of possible value for id
  const paths = getAllExpenseIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  // Fetch necessary data for the expense using params.id
  const expenseData = getExpenseData(params.id as string);
  return {
    props: {
      expenseData,
    },
  };
};
