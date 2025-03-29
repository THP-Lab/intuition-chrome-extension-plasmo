import React from "react"


const portalStyles = `
  .outer-circle {
    transform-origin: 50% 50%;
    stroke-linecap: round;
    stroke-dasharray: 68.1 4.4 12.6 4.4 68.1 4.4 12.6 4.4 68.1 4.4;
    animation: spinCW 12s linear infinite;
  }

  .middle-circle {
    transform-origin: 50% 50%;
    stroke-linecap: round;
    stroke-dasharray: 68.1 4.4 12.6 4.4 68.1 4.4 12.6 4.4 68.1 4.4;
    animation: spinCCW 12s linear infinite;
  }

  .portal-button:hover .outer-circle {
    animation: spinACW 2s linear infinite;
  }

  .portal-button:hover .middle-circle {
    animation: spinCWFast 2s linear infinite;
  }

  /* Animation pour l'humain qui court */
  .runner-svg {
    height: auto;
    transition: transform 0.5s ease;
  }

  .portal-button:hover .runner-svg {
    transform: translateX(50px);
  }

  @keyframes spinCW {
    from { transform: rotate(0deg) scale(1); }
    to   { transform: rotate(360deg) scale(1); }
  }

  @keyframes spinCCW {
    from { transform: rotate(0deg) scale(1); }
    to   { transform: rotate(-360deg) scale(1); }
  }

  @keyframes spinACW {
    0% { transform: rotate(0deg) scale(1); }
    20% { transform: rotate(-30deg) scale(0.95); }
    100% { transform: rotate(-360deg) scale(1); }
  }

  @keyframes spinCWFast {
    0% { transform: rotate(0deg) scale(1); }
    20% { transform: rotate(30deg) scale(0.95); }
    100% { transform: rotate(360deg) scale(1); }
  }

  /* Styles spécifiques au thème */
  @media (prefers-color-scheme: dark) {
    .outer-circle, .middle-circle {
      stroke: white;
    }
    .inner-circle {
      fill: black;
    }
    .runner-svg {
      fill: white;
    }
  }

  @media (prefers-color-scheme: light) {
    .outer-circle, .middle-circle {
      stroke: black;
    }
    .inner-circle {
      fill: white;
    }
    .runner-svg {
      fill: black;
    }
  }

  /* Adaptation pour le système de thème de Tailwind */
  :root.dark .outer-circle, 
  :root.dark .middle-circle {
    stroke: white;
  }
  
  :root.dark .inner-circle {
    fill: black;
  }
  
  :root.dark .runner-svg {
    fill: white;
  }
  
  :root:not(.dark) .outer-circle, 
  :root:not(.dark) .middle-circle {
    stroke: black;
  }
  
  :root:not(.dark) .inner-circle {
    fill: white;
  }
  
  :root:not(.dark) .runner-svg {
    fill: black;
  }
`

type IntuitionPortalProps = {
  size?: number
  onClick?: () => void
  className?: string
  showStyles?: boolean
  showRunner?: boolean
  runnerSize?: number
  children?: React.ReactNode
}

const IntuitionPortalPanel: React.FC<IntuitionPortalProps> = ({
  size = 60,
  onClick,
  className = "",
  showStyles = true,
  showRunner = false,
  runnerSize = 40,
  children
}) => {
  return (
    <>
      {showStyles && <style>{portalStyles}</style>}
      
      <button 
        onClick={onClick}
        className={`portal-button flex items-center justify-center gap-2 cursor-pointer  ${className}`}
      >
        {showRunner && (
          <svg className="runner-svg" width={runnerSize} height={runnerSize} viewBox="0 0 478 515" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d_10_50)">
              <circle cx="366.5" cy="46.5" r="46.5" />
              <ellipse cx="125" cy="148.5" rx="25" ry="24.5" />
              <circle cx="204" cy="96" r="25" />
              <circle cx="327" cy="141" r="25" />
              <circle cx="327" cy="141" r="25" />
              <circle cx="33" cy="361" r="29" />
              <circle cx="150" cy="361" r="29" />
              <circle cx="268" cy="478" r="29" />
              <ellipse cx="449" cy="234" rx="25" ry="24" />
              <ellipse cx="367" cy="224" rx="26" ry="25" />
              <ellipse cx="327.5" cy="345" rx="28.5" ry="29" />
              <ellipse cx="216" cy="258.5" rx="36" ry="38.5" />
              <rect x="33" y="332" width="113" height="58" />
              <rect x="126.114" y="343.938" width="96.1067" height="58" transform="rotate(-55.3306 126.114 343.938)" />
              <rect x="187.248" y="235.063" width="133.324" height="86.157" transform="rotate(-56.1801 187.248 235.063)" />
              <rect x="240" y="467.721" width="148.534" height="58" transform="rotate(-65.6787 240 467.721)" />
              <rect x="221.206" y="238.494" width="148.484" height="58.8262" transform="rotate(34.0445 221.206 238.494)" />
              <rect x="374.19" y="201.299" width="75.8098" height="48.2411" transform="rotate(6.72154 374.19 201.299)" />
              <rect x="350.972" y="134" width="86.9333" height="48.2411" transform="rotate(65.714 350.972 134)" />
              <rect x="296.449" y="90.742" width="56.5734" height="47.979" transform="rotate(34.0035 296.449 90.742)" />
              <rect x="207.258" y="71.7039" width="91.1731" height="48.2081" transform="rotate(11.9766 207.258 71.7039)" />
              <rect x="113.688" y="126.922" width="91.1731" height="48.762" transform="rotate(-34.301 113.688 126.922)" />
            </g>
            <defs>
              <filter id="filter0_d_10_50" x="0" y="0" width="478" height="515" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_10_50"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_10_50" result="shape"/>
              </filter>
            </defs>
          </svg>
        )}
        
        <svg 
          className="w-[auto] h-[auto]" 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          
          <circle className="outer-circle" cx="50" cy="50" r="40" strokeWidth="2.8" fill="none" />
          
          <circle className="middle-circle" cx="50" cy="50" r="36" strokeWidth="2.8" fill="none" />
      
          <circle className="inner-circle" cx="50" cy="50" r="32" />
        </svg>
        
        {children}
      </button>
    </>
  )
}

export default IntuitionPortalPanel