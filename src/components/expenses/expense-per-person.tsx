import { Text, Card, Box } from "rebass";
import { Expense } from "../../redux/reducers";

export default function ExpensePerPerson({
  allExpensesData,
  userName,
  userId,
  size,
}: {
  allExpensesData: Expense[];
  userName: string;
  userId: number;
  size: number;
}) {
  const allAmount = allExpensesData.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const paidAmount = allExpensesData
    .filter((expense) => expense.paidBy.id === userId)
    .reduce((sum, filteredExpense) => sum + filteredExpense.amount, 0);
  return (
    <Box key={userId.toString()} width={1 / size} px={2}>
      <Text>{userName}</Text>
      <Text>Paid ¥{paidAmount}</Text>
      <Text>Have to pay ¥{allAmount / 2 - paidAmount}</Text>
    </Box>
  );
}
