import React from "react";
import { Link } from "react-router-dom"

interface TagsProps {
  label?: string[]
  id?: string[]

  addButton?: React.ReactNode
}

const Tags: React.FC<TagsProps> = ({ tags, addButton }) => {

  if (!tags || tags.length === 0) return null

  return (
      <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag, index) => (
        <Link
          key={index}
          to={`/tags/${tag.id}`}
          className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full hover:bg-gray-600 transition"
        >
          {tag.label}
        </Link>
      ))}

      {addButton && addButton}
      </div>
  )
}


export default Tags