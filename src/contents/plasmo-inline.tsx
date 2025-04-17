import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useEffect, useState } from "react"
import { whitechain } from "~node_modules/viem/_types/chains"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"



export const config: PlasmoCSConfig = {
    matches: ["https://*/*"]
}

export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
    document.querySelector(`body`)

// Use this to optimize unmount lookups
export const getShadowHostId = () => "plasmo-inline-example-unique-id"

function PlasmoInline() {
    const [currentUrl, setCurrentUrl] = useState<string>("")



    navigation.addEventListener("navigate", (event) => {
        const url = new URL(event.destination.url)
        setCurrentUrl(url.href);

    })

    window.addEventListener("load", () => {
        const url = new URL(window.location.href)
        setCurrentUrl(url.href);

    })

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
                style={{
                    borderRadius: 10,
                    padding: 10,
                    background: "black",
                    color: "white",
                    right: "12px",
                    bottom: "50%",
                    position: "fixed",
                    border: "1px solid #fff"
                }}>
                <IntuitionSearchIcon
                    onSearch={handleSearch}
                    size={50}
                    position={{
                        x: 0,
                        y: 0
                    }}
                    className="hover:opacity-80 transition-opacity"
                />

            </div>
        </div>

    )
}

export default PlasmoInline