import { Category } from "../redux/reducers";
import fetch from "node-fetch";

export const getSortedCategoriesData = async () => {
  //TODO get data from database, but for now, use testCategories
  const apiEndpoint =
    process.env.API_ENDPOINT ||
    "https://491qlrloe6.execute-api.us-east-1.amazonaws.com/dev/dev/graphql";
  const res = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query { categories { id name } }`,
    }),
  });
  const result = await res.json();
  const allCategoriesData: Category[] = result.data.categories;
  // Sort Categories by id
  return allCategoriesData.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1;
    }
  }) as Category[];
};

// export const getAllCategoryIds = () => {
//   return testCategories.map(({ id }) => {
//     return {
//       params: {
//         id: id.toString(),
//       },
//     };
//   });
// };
