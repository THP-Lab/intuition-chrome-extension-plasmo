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
  userStake,
  userCounterStake,
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
  userStake: number
  userCounterStake: number
  isFirst?: boolean
  isLast?: boolean
}) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f4f7fb",
    border: "1px solid rgba(100, 100, 100, 0.1)",
    borderRadius: "12px",
    gap: "12px"
  }

  const tripleStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
    minWidth: 0
  }

  const atomStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    border: "1px solid black",
    borderRadius: "9999px",
    padding: "3px 8px",
    fontSize: "13px"
  }

  const rightColStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    minWidth: "70px"
  }
  
  const votesStyle: React.CSSProperties = {
    display: "flex",
    gap: "6px",
    fontSize: "13px",
    marginRight: "16px"
  }

  const positionTagStyle = (isFor: boolean): React.CSSProperties => ({
    border: `1px solid ${isFor ? "#e67e22" : "#3498db"}`,
    color: isFor ? "#e67e22" : "#3498db",
    fontSize: "11px",
    borderRadius: "6px",
    padding: "2px 6px",
    transition: "all 0.3s ease",
    textAlign: "center",
    cursor: "default"
  })

  return (
    <>
      <div style={containerStyle}>
        {/* Triple (sujet-predicate-objet) */}
        <div style={tripleStyle}>
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

          {/* User position tag */}
          <div
            style={{
              border: `1px solid ${userStake > 0 ? "#e67e22" : "#3498db"}`,
              color: userStake > 0 ? "#e67e22" : "#3498db",
              borderRadius: "8px",
              padding: "4px 8px",
              fontSize: "12px",
              cursor: "default",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = userStake > 0 ? "#e67e22" : "#3498db"
              e.currentTarget.style.color ="white"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "Transparent"
              e.currentTarget.style.color = userStake > 0 ? "#e67e22" : "#3498db"
            }}
           >
             ↑↓{userStake > 0 ? "FOR" : "AGAINST"}
            </div>   
      </div>
      

    </>
  )
}

export default ClaimRowLite
