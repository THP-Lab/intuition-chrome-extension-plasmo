import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { umami } from "~src/lib/umami"

const PageViewTracker = () => {
    const location = useLocation()

    useEffect(() => {
        // Track page view whenever location changes
        umami("page_view", { path: location.pathname }, location.pathname)
    }, [location])

    return null // This component doesn't render anything
}

export default PageViewTracker 