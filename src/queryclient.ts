import { GraphQLClient } from "graphql-request";
const API_URL = "https://testnet.intuition.sh/v1/graphql";
const graphqlClient = new GraphQLClient(API_URL);

export default graphqlClient;
