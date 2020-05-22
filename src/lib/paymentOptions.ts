import { PaymentOption } from "../redux/reducers";
import fetch from "node-fetch";

export const getSortedPaymentOptionsData = async () => {
  //TODO get data from database, but for now, use testPaymentOptions
  const apiEndpoint =
    process.env.API_ENDPOINT ||
    "https://491qlrloe6.execute-api.us-east-1.amazonaws.com/dev/dev/graphql";
  const res = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query { paymentOptions { id name } }`,
    }),
  });
  const result = await res.json();
  const allPaymentOptionsData: PaymentOption[] = result.data.paymentOptions;

  // Sort PaymentOptions by id
  return allPaymentOptionsData.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1;
    }
  }) as {
    id: number;
    name: string;
  }[];
};

// export const getAllPaymentOptionIds = () => {
//   return testPaymentOptions.map(({ id }) => {
//     return {
//       params: {
//         id: id.toString(),
//       },
//     };
//   });
// };
