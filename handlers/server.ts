import { ApolloServer as LocalApolloServer } from "apollo-server";
import { ApolloServer } from "apollo-server-lambda";

import { schema } from "./schema";
import { createContext } from "./context";

const local = process.env.NODE_ENV === "local";
console.log("local :>> ", local);
console.log("process.env.NODE_ENV  :>> ", process.env.NODE_ENV);
if (!local) {
  const server = new ApolloServer({
    schema,
    context: createContext,
  });
  exports.handler = server.createHandler();
} else {
  const server = new LocalApolloServer({
    schema,
    context: createContext,
  });
  server.listen({ port: 4000 }, () =>
    console.log(
      `🚀 Server ready at: http://localhost:4000\n⭐️See sample queries: http://pris.ly/e/ts/graphql-apollo-server#using-the-graphql-api`
    )
  );
}
