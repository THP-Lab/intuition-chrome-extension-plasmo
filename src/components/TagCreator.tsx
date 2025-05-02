import React, { useState } from "react"
import AtomAutocompleteInput from "./AtomAutocompleteInput"
import { useCreateTriples } from "~src/hooks/useCreateTriples"
import { useCreatePosition } from "~src/hooks/useCreatePosition"
import { Multivault } from "@0xintuition/protocol"
import { getClients } from "~src/lib/viemClient"

interface TagCreatorProps {
  subjectAtom: {
    id: string
    label: string
    vault_id: string
  }
  onTagCreated?: () => void
}

const TagCreator: React.FC<TagCreatorProps> = ({ subjectAtom, onTagCreated }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState<any | null>(null)
  const [vote, setVote] = useState<"for" | "against" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const { addTriple, createTriples, clearTriples } = useCreateTriples()
  const { createPosition } = useCreatePosition()

}


export default TagCreator; 