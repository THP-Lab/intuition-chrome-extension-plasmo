export function normalizeUrl(input: string): string {
  try {
    const u = new URL(input)
    let hostname = u.hostname.toLowerCase()
    if (hostname.startsWith("www.")) hostname = hostname.slice(4)
    let pathname = u.pathname
    if (pathname.endsWith("/") && pathname.length > 1) {
      pathname = pathname.slice(0, -1)
    }
    return `https://${hostname}${pathname}${u.search}${u.hash}`
  } catch {
    return input
  }
}

export function buildUriRegex(rawUrl: string): string {
  const canonical = normalizeUrl(rawUrl)
  let withoutProto = canonical.replace(/^https?:\/\//, "")
  if (withoutProto.endsWith("/")) withoutProto = withoutProto.slice(0, -1)
  const escaped = withoutProto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return `^https?:\\/\\/(?:www\\.)?${escaped}\\/?$`
}