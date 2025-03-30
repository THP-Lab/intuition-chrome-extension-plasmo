import React from "react"
import { format } from "date-fns"

type Activity = {
  type: "atom_created"
  detail: string
  timestamp: string
}

const mockActivities: Activity[] = [
  {
    type: "atom_created",
    detail: "Gravity Theory",
    timestamp: "2025-03-30T14:52:00Z"
  },
  {
    type: "atom_created",
    detail: "Quantum Entanglement",
    timestamp: "2025-03-29T10:15:00Z"
  },
  {
    type: "atom_created",
    detail: "String Theory",
    timestamp: "2025-03-28T18:30:00Z"
  }
]

const RecentActivity = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Activité récente</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Activité</th>
              <th className="px-4 py-2 text-left">Détail</th>
              <th className="px-4 py-2 text-left">Jour</th>
              <th className="px-4 py-2 text-left">Heure</th>
            </tr>
          </thead>
          <tbody>
            {mockActivities.map((activity, index) => {
              const date = new Date(activity.timestamp)
              return (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 capitalize text-sm text-gray-700">
                    {activity.type.replace("_", " ")}
                  </td>
                  <td className="px-4 py-2 text-sm">{activity.detail}</td>
                  <td className="px-4 py-2 text-sm">
                    {format(date, "yyyy-MM-dd")}
                  </td>
                  <td className="px-4 py-2 text-sm">{format(date, "HH:mm")}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentActivity
