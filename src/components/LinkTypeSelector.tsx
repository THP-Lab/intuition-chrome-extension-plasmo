import React from "react"

export const LinkTypeSelector = ({
  linkType,
  setLinkType
}: {
  linkType: string
  setLinkType: (type: "url" | "domain") => void
}) => (
  <div className="relative max-w-sm flex w-full flex-col rounded-xl shadow mx-auto">
    <div className="flex flex-row gap-8 p-2 bg-[hsl(var(--claims-bg))] justify-center rounded-xl">
      <div
        role="button"
        className="w-full px-4 py-1 bg-background text-foreground rounded hover:bg-[hsl(var(--accent))] text-center"
      >
        <label
          htmlFor="url-switch"
          className="flex w-full cursor-pointer items-center justify-center"
        >
          <div className="inline-flex items-center">
            <label className="relative flex items-center cursor-pointer" htmlFor="url-switch">
              <input
                name="link-type"
                type="radio"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                id="url-switch"
                checked={linkType === "url"}
                onChange={() => setLinkType("url")}
              />
              <span className="absolute bg-[hsl(var(--primary))] dark:bg-slate-50 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
            </label>
            <label className="ml-2 font-bold cursor-pointer text-sm" htmlFor="url-switch">
              URL
            </label>
          </div>
        </label>
      </div>
      <div
        role="button"
        className="w-full px-4 py-1 bg-background text-foreground rounded hover:bg-[hsl(var(--accent))] text-center"
      >
        <label
          htmlFor="domain-switch"
          className="flex w-full cursor-pointer items-center justify-center"
        >
          <div className="inline-flex items-center">
            <label className="relative flex items-center cursor-pointer" htmlFor="domain-switch">
              <input
                name="link-type"
                type="radio"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                id="domain-switch"
                checked={linkType === "domain"}
                onChange={() => setLinkType("domain")}
              />
              <span className="absolute bg-[hsl(var(--primary))] dark:bg-slate-50 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
            </label>
            <label className="ml-2 font-bold cursor-pointer text-sm" htmlFor="domain-switch">
              Domain
            </label>
          </div>
        </label>
      </div>
    </div>
  </div>
)