import { User } from "../redux/reducers";
import fetch from "node-fetch";

export const getSortedUsersData = async () => {
  //TODO get data from database, but for now, use testUsers
  const apiEndpoint =
    process.env.API_ENDPOINT ||
    "https://491qlrloe6.execute-api.us-east-1.amazonaws.com/dev/dev/graphql";
  const res = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query { users { id name } }`,
    }),
  });
  const result = await res.json();
  const allUsersData: User[] = result.data.users;

  // Sort users by id
  return allUsersData.sort((a, b) => {
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
