import React from "react"
import { useEventsSubscription } from "~src/graphql/src/generated/subscriptions"

const RecentActivity: React.FC = () => {

  let { data, loading, error, restart } = useEventsSubscription();



  if (error) return (
    <p>error : {error.message}</p>
  )

  if (loading) return (
    <p>Loading ...</p>
  )

  console.log(data);


  if (data)
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Live Feed</h1>
        <div className="space-y-4">
          {data.events.map(e => {
            return `
             <p>${e.type}</p>
            `
          })}
        </div>
      </div>
    )
}

export default RecentActivity
