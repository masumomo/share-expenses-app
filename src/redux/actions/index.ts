import { InputExpense } from "../reducers";

//Action Types
export const ADD_EXPENSES = "ADD_EXPENSES";
export const MODIFY_EXPENSES = "MODIFY_EXPENSES";
export const SET_CURRENT_DISPLAY_DATA = "SET_CURRENT_DISPLAY_DATA";
export const SET_NEXT_MONTH_DATA = "SET_NEXT_MONTH_DATA";
export const SET_PREVIOUS_MONTH_DATA = "SET_PREVIOUS_MONTH_DATA";

//Action Creator
export const addExpense = (expense: InputExpense) => ({
  type: ADD_EXPENSES,
  expense,
});

export const modifyExpense = (id: number, expense: InputExpense) => ({
  type: MODIFY_EXPENSES,
  id,
  expense,
});

export const setCurrentDisplayData = (date: Date) => ({
  type: SET_CURRENT_DISPLAY_DATA,
  date,
});

export const setNextMonthData = () => ({
  type: SET_NEXT_MONTH_DATA,
});

export const setPreviousMonthData = () => ({
  type: SET_PREVIOUS_MONTH_DATA,
});
