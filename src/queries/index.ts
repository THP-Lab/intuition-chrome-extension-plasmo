import { useQuery, useQueryClient } from "@tanstack/react-query"

import graphqlClient from "~src/queryclient"

import { searchAtomsByUriQuery } from "./queries"

const searchAtomsByUri = async (address: string, uri: string) => {
  return graphqlClient.request(searchAtomsByUriQuery, { address, uri })
}

export const useSearchAtomsByUriQuery = (
  address: string,
  uri: string | undefined
) => {
  if (uri) {
    return useQuery({
      queryKey: ["GetAtomsByUri", address, uri],
      queryFn: () => searchAtomsByUri(address, uri)
    })
  }
}
