import React from "react"

export const ClaimRowLite = ({
  subjectLabel,
  subjectImage,
  predicateLabel,
  predicateImage,
  objectLabel,
  objectImage,
  numPositionsFor,
  numPositionsAgainst,
  isFirst = true,
  isLast = true
}: {
  subjectLabel: string
  subjectImage?: string
  predicateLabel: string
  predicateImage?: string
  objectLabel: string
  objectImage?: string
  numPositionsFor: number
  numPositionsAgainst: number
  isFirst?: boolean
  isLast?: boolean
}) => {
  const containerStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between", // <-- place les votes à droite
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    border: "1px solid rgba(100, 100, 100, 0.1)",
    borderTopLeftRadius: isFirst ? "12px" : "0",
    borderTopRightRadius: isFirst ? "12px" : "0",
    borderBottomLeftRadius: isLast ? "12px" : "0",
    borderBottomRightRadius: isLast ? "12px" : "0",
    padding: "10px",
    marginBottom: "10px"
  }

  const atomStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid black",
    borderRadius: "9999px",
    padding: "4px 10px",
    fontSize: "14px"
  }

  const tripletStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    alignItems: "center"
  }

  const votesStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    fontSize: "12px"
  }

  return (
    <div style={containerStyle}>
      {/* Triple (sujet-predicate-objet) */}
      <div style={tripletStyle}>
        {/* Subject */}
        <div style={atomStyle}>
          {subjectImage && (
            <img
              src={subjectImage}
              alt="subject"
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />
          )}
          <span>{subjectLabel}</span>
        </div>

        {/* Predicate */}
        <div style={atomStyle}>
          {predicateImage && (
            <img
              src={predicateImage}
              alt="predicate"
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />
          )}
          <span>{predicateLabel}</span>
        </div>

        {/* Object */}
        <div style={atomStyle}>
          {objectImage && (
            <img
              src={objectImage}
              alt="object"
              style={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />
          )}
          <span>{objectLabel}</span>
        </div>
      </div>

      {/* Votes */}
      <div style={votesStyle}>
        <span style={{ color: "blue" }}>↑ {numPositionsFor}</span>
        <span style={{ color: "orange" }}>↓ {numPositionsAgainst}</span>
      </div>
    </div>
  )
}

export default ClaimRowLite
