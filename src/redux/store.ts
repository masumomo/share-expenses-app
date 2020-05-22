import { createStore } from "redux";

import { MakeStore, createWrapper, Context } from "next-redux-wrapper";
import reducer, { State } from "./reducers";

// create a makeStore function
const makeStore: MakeStore<State> = (context: Context) => {
  const store = createStore(reducer);
  return store;
};

// export an assembled wrapper
export const wrapper = createWrapper<State>(makeStore, { debug: true });
