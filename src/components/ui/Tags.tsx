import React from "react";


interface TagsProps {
  tags?: string[]
  addButton?: React.ReactNode
}

const Tags: React.FC<TagsProps> = ({ tags, addButton }) => {

  if (!tags || tags.length === 0) return null

  return (
      <div className="mt-6 flex flex-wrap gap-2 items-center">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}

        {addButton && addButton}
      </div>
  )
}


export default Tags