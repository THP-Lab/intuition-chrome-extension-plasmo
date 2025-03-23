import { createRoot } from "react-dom/client"
import IndexPopup from "./IndexPopup"
import { ApolloProvider } from "@apollo/client"
import { client } from "../lib/apollo"

const root = createRoot(document.getElementById("root")!)
root.render(
  <ApolloProvider client={client}>
    <IndexPopup />
  </ApolloProvider>
)

