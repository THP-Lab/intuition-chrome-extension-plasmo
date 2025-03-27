import { useState } from "react"
import { useGetAccountByIdQuery } from "~src/graphql/src"
import { useStorage } from "@plasmohq/storage/hook"
import SignUpForm from "../SignUpForm"
import { cn } from "~src/lib/utils"

const AccountSection = () => {
  const [address] = useStorage<string>("metamask-account")
  const [editMode, setEditMode] = useState(false)
  const { data: accountData } = useGetAccountByIdQuery({
    id: address || ""
  })
  const account = accountData?.account

  return (
    <section className={cn(
      "border rounded-lg p-4",
      "bg-background text-foreground",
      "shadow-sm hover:shadow-md transition-shadow"
    )}>
      <h2 className="text-xl font-semibold mb-4">Account Info</h2>

      {!account || editMode ? (
        <SignUpForm
          defaultValues={
            account
              ? {
                  name: account.name,
                  image: account.image || "",
                  description: "",
                  url: "",
                  email: "",
                  identifier: ""
                }
              : undefined
          }
          onSuccess={() => setEditMode(false)}
        />
      ) : (
        <div className="space-y-4">
          <p className="flex items-center gap-2">
            <span className="font-medium">Label:</span>
            <span className="text-muted-foreground">{account.label}</span>
            <span className="text-muted-foreground">{account.name}</span>
          </p>

          {account.image && (
            <div className="space-y-2">
              <span className="font-medium">Image:</span>
              <img
                src={account.image}
                alt="profile"
                className="w-24 h-24 rounded-md object-cover border border-border"
              />
            </div>
          )}

          <button
            className={cn(
              "w-full px-4 py-2 bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded"
            )}
            onClick={() => setEditMode(true)}
          >
            Edit Account
          </button>
        </div>
      )}
    </section>
  )
}

export default AccountSection
