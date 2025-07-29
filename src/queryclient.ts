import { GraphQLClient } from "graphql-request";
const API_URL = "https://prod.base-mainnet-v-1-0.intuition.sh/v1/graphql";
const graphqlClient = new GraphQLClient(API_URL);

export default graphqlClient;
