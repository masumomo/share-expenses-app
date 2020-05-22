import { default as NextLink } from "next/link";
import { Text, Flex, Link } from "rebass";
import { NormalDate } from "../display-date";
import { Expense } from "../../redux/reducers";

export default function ExpenseSummary({
  dateExpense,
}: {
  dateExpense: Expense;
}) {
  return (
    <Flex mx={2}>
      <NextLink
        href="/expenses/[id]"
        as={`/expenses/${dateExpense.id.toString()}`}
      >
        <Link width={1 / 3} href="#">
          {dateExpense.title} by {dateExpense.paidBy.name}
        </Link>
      </NextLink>

      <Text width={1 / 3}>{dateExpense.memo}</Text>

      <Text width={1 / 3}>
        <NormalDate dateString={dateExpense.createdAt} />
      </Text>
    </Flex>
  );
}
