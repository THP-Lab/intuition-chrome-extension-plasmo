import { GraphQLClient } from "graphql-request";
const API_URL = "https://dev.base.intuition-api.com/v1/graphql";
const graphqlClient = new GraphQLClient(API_URL);

export default graphqlClient;
