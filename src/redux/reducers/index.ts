import { AnyAction } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import {
  SET_CURRENT_DISPLAY_DATA,
  SET_NEXT_MONTH_DATA,
  SET_PREVIOUS_MONTH_DATA,
  ADD_EXPENSES,
  MODIFY_EXPENSES,
} from "../actions";
import { formatISO, isSameMonth, addMonths, parseISO } from "date-fns";

export interface Expense {
  id: number;
  title: string;
  memo: string;
  amount: number;
  weightedAmount: number;
  paidBy: User;
  paymentOption: PaymentOption;
  createdAt: string;
  createdBy: User;
  category: Category;
}
export interface InputExpense {
  title: string;
  memo: string;
  amount: number;
  weightedAmount: number;
  paidBy: User;
  paymentOption: PaymentOption;
  createdAt: string;
  createdBy: User;
  category: Category;
}
export interface User {
  name: string;
  id: number;
}

export interface PaymentOption {
  name: string;
  id: number;
}
export interface Category {
  name: string;
  id: number;
}
export interface State {
  currentDisplayedDate: string;
  currentDisplayedExpenses: Expense[];
  allExpenses: Expense[];
}
export interface setCurrentDisplayData {
  type: typeof SET_CURRENT_DISPLAY_DATA;
  date: Date;
}

export interface setNextMonthData {
  type: typeof SET_NEXT_MONTH_DATA;
}

export interface setPreviousMonthData {
  type: typeof SET_PREVIOUS_MONTH_DATA;
}

export interface ExpensesState {
  expenses: Expense[];
}

export interface addExpense {
  type: typeof ADD_EXPENSES;
  expense: InputExpense;
}

export interface modifyExpense {
  type: typeof MODIFY_EXPENSES;
  id: number;
  expenses: InputExpense;
}
const initialState: State = {
  currentDisplayedDate: formatISO(new Date()),
  currentDisplayedExpenses: [],
  allExpenses: [],
};

const reducer = (state: State = initialState, action: AnyAction) => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload };
    case ADD_EXPENSES:
      console.log(
        "ADD_EXPENSES currentDisplayedExpenses :>> ",
        state.currentDisplayedExpenses
      );
      return {
        ...state,
        allExpenses: state.allExpenses.concat({
          ...action.expense,
          id: state.allExpenses.length + 1,
        }),
        currentDisplayedExpenses: state.allExpenses.concat(
          isSameMonth(
            parseISO(state.currentDisplayedDate),
            parseISO(action.expense.createdAt)
          )
            ? { ...action.expense, id: state.allExpenses.length + 1 }
            : []
        ),
      };
    case MODIFY_EXPENSES:
      return {
        ...state,
        allExpenses: state.allExpenses
          .filter((x) => x.id !== action.id)
          .concat({
            ...action.expense,
            id: action.id,
          }),
        currentDisplayedExpenses: state.allExpenses.filter((expense: Expense) =>
          isSameMonth(
            parseISO(state.currentDisplayedDate),
            parseISO(expense.createdAt)
          )
        ),
      };
    case SET_CURRENT_DISPLAY_DATA:
      console.log("action.data :>> ", action.data);
      return {
        ...state,
        currentDisplayedDate: action.date,
        currentDisplayedExpenses: state.allExpenses.filter((expense: Expense) =>
          isSameMonth(parseISO(action.date), parseISO(expense.createdAt))
        ),
      };
    case SET_NEXT_MONTH_DATA:
      return {
        ...state,
        currentDisplayedDate: formatISO(
          addMonths(parseISO(state.currentDisplayedDate), 1)
        ),
        currentDisplayedExpenses: state.allExpenses.filter((expense: Expense) =>
          isSameMonth(
            addMonths(parseISO(state.currentDisplayedDate), 1),
            parseISO(expense.createdAt)
          )
        ),
      };
    case SET_PREVIOUS_MONTH_DATA:
      return {
        ...state,
        currentDisplayedDate: formatISO(
          addMonths(parseISO(state.currentDisplayedDate), -1)
        ),
        currentDisplayedExpenses: state.allExpenses.filter((expense: Expense) =>
          isSameMonth(
            addMonths(parseISO(state.currentDisplayedDate), -1),
            parseISO(expense.createdAt)
          )
        ),
      };
    default:
      return { ...state };
  }
};

export default reducer;
