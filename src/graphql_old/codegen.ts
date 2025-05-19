import { CodegenConfig } from "@graphql-codegen/cli"
import type { Types } from "@graphql-codegen/plugin-helpers"

import { API_URL_PROD } from "./src/constants"

const commonGenerateOptions: Types.ConfiguredOutput = {
  config: {
    reactQueryVersion: 5,
    fetcher: {
      func: "../client#fetcher",
      isReactHook: false
    },
    exposeDocument: true,
    exposeFetcher: true,
    exposeQueryKeys: true,
    exposeMutationKeys: true,
    addInfiniteQuery: true,
    enumsAsTypes: true,
    dedupeFragments: true,
    documentMode: "documentNode",
    scalars: {
      Date: "Date",
      JSON: "Record<string, any>",
      ID: "string",
      Void: "void"
    }
  },
  plugins: [
    "typescript",
    "@graphql-codegen/typescript-operations",
    "@graphql-codegen/typescript-react-query",
    "typescript-document-nodes"
  ]
}

const config: CodegenConfig = {
  overwrite: true,
  hooks: { afterAllFileWrite: ["prettier --write"] },
  schema: {
    [API_URL_PROD]: {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  },
  ignoreNoDocuments: true,
  documents: ["**/*.graphql"],
  generates: {
    // Main output using react-query
    "./src/generated/index.ts": {
      config: {
        ...commonGenerateOptions.config
      },
      plugins: commonGenerateOptions.plugins
    },

    // Apollo Client output for subscriptions
    "./src/generated/subscriptions.ts": {
      documents: ["src/graphql/subscriptions/**/*.graphql"], // Or wherever you place your .graphql subscription ops
      plugins: [
        "typescript",
        "@graphql-codegen/typescript-operations",
        "@graphql-codegen/typescript-react-apollo"
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        scalars: {
          Date: "Date",
          JSON: "Record<string, any>",
          ID: "string",
          Void: "void"
        },
        documentMode: "documentNode"
      }
    },


    // Apollo Client output for subscriptions
    "./src/generated/subscriptions.ts": {
      documents: ["src/graphql/subscriptions/**/*.graphql"], // Or wherever you place your .graphql subscription ops
      plugins: [
        "typescript",
        "@graphql-codegen/typescript-operations",
        "@graphql-codegen/typescript-react-apollo"
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        scalars: {
          Date: "Date",
          JSON: "Record<string, any>",
          ID: "string",
          Void: "void"
        },
        documentMode: "documentNode"
      }
    },

    // Optional: export your schema
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true
      }
    }
  },
  watch: process.env.NODE_ENV === "development"
}

export default config
