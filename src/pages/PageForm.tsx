import React, { useState } from "react"
import * as Switch from "@radix-ui/react-switch"

import AtomForm from "../components/AtomForm"
import TripleForm from "../components/TripleForm"

function PageForm() {
  const [showTripleForm, setShowTripleForm] = useState(false)

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="form-switch" className="text-sm text-white">
          {showTripleForm ? "Claim" : "Atom"}
        </label>
        <Switch.Root
          id="form-switch"
          checked={showTripleForm}
          onCheckedChange={setShowTripleForm}
          className="relative w-[42px] h-[25px] rounded-full bg-gray-500 data-[state=checked]:bg-gray-800 transition-colors duration-200 ease-in-out"
        >
          <Switch.Thumb
            className="block w-[21px] h-[21px] rounded-full bg-white shadow transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[19px]"
          />
        </Switch.Root>

      </div>

      {showTripleForm ? <TripleForm /> : <AtomForm />}
    </div>
  )
}

export default PageForm

