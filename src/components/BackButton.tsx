import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackTo?: string
  label?: string
}

const BackButton: React.FC<BackButtonProps> = ({
  fallbackTo = '/',
  label = 'Return'
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(fallbackTo)
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-grey-400 hover:underline"
    >
      <ArrowLeft className="w-4 h-4 mr-1" />
      {label}
    </button>
  )
}

export default BackButton
