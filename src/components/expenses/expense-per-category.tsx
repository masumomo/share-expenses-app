import { Text, Flex } from "rebass";
import { Expense } from "../../redux/reducers";

export default function ExpensePerCategory({
  allExpensesData,
  categoryName,
  categoryId,
}: {
  allExpensesData: Expense[];
  categoryName: string;
  categoryId: number;
}) {
  const amountPerCategory = allExpensesData
    .filter((expense) => expense.category.id === categoryId)
    .reduce((sum, filteredExpense) => sum + filteredExpense.amount, 0);

  const totalAmount = allExpensesData.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  return (
    <Flex key={categoryId.toString()} mx={2}>
      <Text width={1 / 3}>{categoryName}</Text>
      <Text width={1 / 3}>¥{amountPerCategory}</Text>
      <Text width={1 / 3}>
        {Math.floor((amountPerCategory / totalAmount) * 100)}%
      </Text>
    </Flex>
  );
}
