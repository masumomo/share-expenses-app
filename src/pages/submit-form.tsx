import Head from "next/head";
import Router from "next/router";
import Layout from "../components/layout";
import { Flex, Box, Button } from "rebass";
import DatePicker from "react-datepicker";

import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { useDispatch } from "react-redux";
import { Heading, Spinner } from "theme-ui";
import { Category, User, PaymentOption } from "../redux/reducers";
import { getSortedUsersData } from "../lib/users";
import { getSortedCategoriesData } from "../lib/categories";
import { getSortedPaymentOptionsData } from "../lib/paymentOptions";
import { addExpense } from "../redux/actions";
import { addExpensesData, getSortedExpensesData } from "../lib/expenses";

export const getServerSideProps = async () => {
  const allUsersData = await getSortedUsersData();
  const allCategoriesData = await getSortedCategoriesData();
  const allPaymentOptionsData = await getSortedPaymentOptionsData();
  return {
    props: {
      allUsersData,
      allCategoriesData,
      allPaymentOptionsData,
    },
  };
};
export default function SubmitForm({
  allUsersData,
  allCategoriesData,
  allPaymentOptionsData,
}: {
  allUsersData: User[];
  allCategoriesData: Category[];
  allPaymentOptionsData: PaymentOption[];
}) {
  const submitExpense = () => {
    const expense = {
      title: "test expense 1",
      memo: { value: "test memo 1", required: true },
      amount: 200,
      weightedAmount: { value: 0, required: true },
      paidById: 1,
      paymentOptionId: 1,
      // createdAt: "2020-05-01T00:00:00Z",
      createdById: 1,
      categoryId: 1,
    };
    addExpensesData(expense)
      .then(async (result) => {
        console.log("submit result :>> ", result);
        // const dispatch = useDispatch();
        // const allExpensesData = await getSortedExpensesData();
        // allExpensesData.forEach((expense) => {
        //   dispatch(addExpense(expense));
        // });
        console.log("expense :>> ", expense);
        Router.push("/");
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  };

  return (
    <Layout home={false}>
      <Head>
        <title>Input expense form</title>
      </Head>
      <Heading>Input expense form</Heading>
      <Box as="form" onSubmit={(e) => e.preventDefault()} py={3}>
        <Flex mx={-2} mb={3}>
          <Box width={1} px={2}>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue="Buy ingredient in Life(supermarket)"
            />
          </Box>
        </Flex>
        {!allCategoriesData ? (
          <Spinner />
        ) : (
          <Flex mx={-2} mb={3}>
            <Box width={1 / 2} px={2}>
              <Label htmlFor="amount">Amount(¥)</Label>
              <Input id="amount" name="amount" defaultValue="0" />
            </Box>
            <Box width={1 / 2} px={2}>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                name="category"
                defaultValue={allCategoriesData[0].name}
              >
                {allCategoriesData.map(({ id, name }) => (
                  <option id={id.toString()} key={id.toString()}>
                    {name}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
        )}
        <Flex mx={-2} mb={3}>
          <Box width={1} px={2}>
            <Label htmlFor="created-at">Paid date</Label>
            <DatePicker
              id="created-at"
              selected={new Date()}
              onChange={(e) => console.log("test :>> ", e)}
            />
          </Box>
        </Flex>
        {!allUsersData || !allPaymentOptionsData ? (
          <Spinner />
        ) : (
          <Flex mx={-2} flexWrap="wrap">
            <Label htmlFor="payment-option">Pay with</Label>
            {allPaymentOptionsData.map(({ id, name }) => (
              <Label
                width={[
                  1 / allPaymentOptionsData.length,
                  (1 / allPaymentOptionsData.length) * 2,
                ]}
                p={2}
                id="payment-option"
                key={id.toString()}
              >
                <Radio
                  id={id.toString()}
                  name="payment-option"
                  value={name}
                  defaultChecked={id === allPaymentOptionsData[0].id}
                />
                {name}
              </Label>
            ))}
            <Label htmlFor="paid-by-user">Paid by</Label>
            {allUsersData.map(({ id, name }) => (
              <Label
                width={[1 / allUsersData.length, (1 / allUsersData.length) * 2]}
                p={2}
                id="paid-by-user"
                key={id.toString()}
              >
                <Radio
                  id={id.toString()}
                  name="paid-user"
                  value={name}
                  defaultChecked={id === allUsersData[0].id}
                />
                {name}
              </Label>
            ))}
          </Flex>
        )}

        <Flex mx={-2} mb={3}>
          <Box width={1}>
            <Label htmlFor="memo">Memo</Label>
            <Textarea id="memo" name="memo" />
          </Box>
        </Flex>

        <Flex mx={-2} mb={3}>
          <Box px={2} ml="auto">
            <Button onClick={submitExpense}>Submit</Button>
            <Label>
              <Checkbox id="continue" name="continue" />
              Continue to input
            </Label>
          </Box>
        </Flex>
      </Box>
    </Layout>
  );
}
