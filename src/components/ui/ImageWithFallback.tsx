import React from "react"
import { Fingerprint } from "lucide-react"

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const ImageWithFallback = ({
  src,
  alt = '',
  className,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = React.useState(false)

  if (error) {
    return <Fingerprint className={className} />
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  )
}


export default ImageWithFallback;