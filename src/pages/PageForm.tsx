import React, { useState, useRef, useEffect } from "react"
import * as Switch from "@radix-ui/react-switch"
import { RefreshCw } from 'lucide-react';

import AtomForm from "../components/AtomForm"
import TripleForm from "../components/TripleForm"
import { usePageMetadata } from "../hooks/usePageMetadata"

function PageForm() {
  const [showTripleForm, setShowTripleForm] = useState(false)

  const atomFormRef = useRef(null)
  const tripleFormRef = useRef(null)
  const meta = usePageMetadata()

  const handleResetForms = () => {
    if (showTripleForm && tripleFormRef.current?.resetForm) {
      tripleFormRef.current.resetForm()
    } else if (!showTripleForm && atomFormRef.current?.resetForm) {
      atomFormRef.current.resetForm()
    }
  }

  return (
<div className="p-2 space-y-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
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
    </div>


    <button
      onClick={handleResetForms}
      className="p-1 mr-2 text-foreground transition-transform duration-300 hover:rotate-180"
      title="Reset form"
    >
      <RefreshCw size={18} />
    </button>
  </div>

  {showTripleForm ? (
    <TripleForm ref={tripleFormRef} />
  ) : (
    <AtomForm
      key={meta.url || "default"}
      ref={atomFormRef}
      initialName={meta.title}
      initialDescription={meta.description}
      initialImage={meta.favicon}
      initialUrl={meta.url}
    />
  )}
</div>
  )
}

export default PageForm