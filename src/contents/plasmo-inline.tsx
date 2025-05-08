import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { whitechain } from "~node_modules/viem/_types/chains"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"



export const config: PlasmoCSConfig = {
    matches: ["https://*/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
    document.querySelector(`body`)

export const getShadowHostId = () => "plasmo-inline-example-unique-id"

function PlasmoInline() {
    const [currentUrl, setCurrentUrl] = useState<string>("")
    const [positionY, setPositionY] = useState<number>(50) 

    useEffect(() => {
        if ("navigation" in window) {
          window.navigation.addEventListener("navigate", (event) => {
            const url = new URL(event.destination.url)
            setCurrentUrl(url.href)
          })
        }
    
        const onLoad = () => {
          const url = new URL(window.location.href)
          setCurrentUrl(url.href)
        }
    
        window.addEventListener("load", onLoad)
        return () => window.removeEventListener("load", onLoad)
      }, [])

    const handleMouseDown = (e: React.MouseEvent) => {
        const startY = e.clientY
        const startPositionY = positionY
      
        const handleMouseMove = (moveEvent: MouseEvent) => {
          const deltaY = moveEvent.clientY - startY
          const newY = startPositionY + (deltaY / window.innerHeight) * 100
          setPositionY(Math.min(90, Math.max(0, newY))) // entre 0% et 90%
        }
      
        const handleMouseUp = () => {
          window.removeEventListener("mousemove", handleMouseMove)
          window.removeEventListener("mouseup", handleMouseUp)
        }
      
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
      }




    const handleSidePanel = () => {
        chrome.runtime.sendMessage({ type: "open_sidepanel" })
    }

    const handleSearch = () => {
        // chrome.runtime.sendMessage({ type: "open_sidepanel" })
    }

    return (
        <div >

            <div
            onClick={handleSidePanel}
            onMouseDown={handleMouseDown}
            style={{
                position: "fixed",
                top: `${positionY}%`,
                right: "12px",
                borderRadius: 10,
                padding: 10,
                background: "black",
                color: "white",
                border: "1px solid #fff",
                cursor: "grab",
                zIndex: 9999
            }}>
            <IntuitionSearchIcon
                onSearch={handleSearch}
                size={50}
                position={{ x: 0, y: 0 }}
                className="hover:opacity-80 transition-opacity"
            />
            </div>
        </div>

    )
}

export default PlasmoInline