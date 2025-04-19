import React, { useState, useRef } from "react"
import * as Switch from "@radix-ui/react-switch"

import AtomForm from "../components/AtomForm"
import TripleForm from "../components/TripleForm"

function PageForm() {
  const [showTripleForm, setShowTripleForm] = useState(false)

  const atomFormRef = useRef(null)
  const tripleFormRef = useRef(null)

  const handleResetForms = () => {
    if (showTripleForm && tripleFormRef.current?.resetForm) {
      tripleFormRef.current.resetForm()
    } else if (!showTripleForm && atomFormRef.current?.resetForm) {
      atomFormRef.current.resetForm()
    }
  }

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="form-switch" className="text-sm text-foreground">
          {showTripleForm ? "Claim" : "Atom"}
        </label>
        <Switch.Root
          id="form-switch"
          checked={showTripleForm}
          onCheckedChange={(checked) => {
            setShowTripleForm(checked)
          }}
          className="relative w-[42px] h-[25px] rounded-full bg-gray-500 data-[state=checked]:bg-gray-800 transition-colors duration-200 ease-in-out"
        >
          <Switch.Thumb
            className="block w-[21px] h-[21px] rounded-full bg-white shadow transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[19px]"
          />
        </Switch.Root>
        <button
          onClick={handleResetForms}
          className="text-sm px-2 py-1 rounded bg-muted hover:bg-accent text-foreground border border-border transition"
          title="Reset form"
        >
          🔄
        </button>
      </div>

      {showTripleForm ? (
        <TripleForm ref={tripleFormRef} />
      ) : (
        <AtomForm ref={atomFormRef} />
      )}
    </div>
  )
}

export default PageForm