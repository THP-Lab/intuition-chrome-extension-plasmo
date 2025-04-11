import React from "react"

export const LinkTypeSelector = ({
  linkType,
  setLinkType
}: {
  linkType: string
  setLinkType: (type: "url" | "domain") => void
}) => (
  <div className="relative max-w-sm flex w-full flex-col rounded-xl shadow">
    <div className="flex flex-row gap-1 p-2">
      <div
        role="button"
        className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
      >
        <label
          htmlFor="url-switch"
          className="flex w-full cursor-pointer items-center px-3 py-2"
        >
          <div className="inline-flex items-center">
            <label className="relative flex items-center cursor-pointer" htmlFor="url-switch">
              <input
                name="link-type"
                type="radio"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                id="url-switch"

              />
              <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
            </label>
            <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="url-switch">
              URL
            </label>
          </div>
        </label>
      </div>
      <div
        role="button"
        className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
      >
        <label
          htmlFor="domain-switch"
          className="flex w-full cursor-pointer items-center px-3 py-2"
        >
          <div className="inline-flex items-center">
            <label className="relative flex items-center cursor-pointer" htmlFor="domain-switch">
              <input
                name="link-type"
                type="radio"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                id="domain-switch"

              />
              <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
            </label>
            <label className="ml-2 text-slate-600 cursor-pointer text-sm" htmlFor="domain-switch">
              Domain
            </label>
          </div>
        </label>
      </div>
    </div>
  </div>
)