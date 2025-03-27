import { GetPersonsByIdentifierDocument } from "~src/graphql/src/generated"
import { request } from "graphql-request"
import { GRAPHQL_ENDPOINT } from "~src/lib/config" // adapte si besoin

export const indexPersonFromIPFS = async (address: string) => {
  console.log("🔍 Indexing person from IPFS for:", address)

  try {
    const res = await request(GRAPHQL_ENDPOINT, GetPersonsByIdentifierDocument, {
      identifier: address,
    })

    console.log("✅ Person indexed:", res.persons?.[0]?.name || "not found")
  } catch (err) {
    console.error("❌ Failed to index person:", err)
  }
}
