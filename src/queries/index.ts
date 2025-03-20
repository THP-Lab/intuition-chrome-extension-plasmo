import { useQuery, useQueryClient } from "@tanstack/react-query"
import { searchAtomsByUriQuery } from "./queries"
import graphqlClient from "~src/queryclient"

const searchAtomsByUri = async (address: string, uri: string) => {
  return graphqlClient.request(searchAtomsByUriQuery, { address, uri })
}

export const useSearchAtomsByUriQuery = (address: string, uri: string) => {
  return useQuery({
    queryKey: ["GetAtomsByUri", address, uri],
    queryFn: () => searchAtomsByUri(address, uri)
  })
}
