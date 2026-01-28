import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    katex: any;
  }
}

interface LatexProps {
  children: string;
  className?: string;
  displayMode?: boolean;
}

const Latex: React.FC<LatexProps> = ({ children, className = '', displayMode = false }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const render = () => {
      if (window.katex && containerRef.current) {
        try {
          window.katex.render(children, containerRef.current, {
            throwOnError: false,
            displayMode: displayMode,
            color: 'inherit'
          });
          setRendered(true);
        } catch (e) {
          console.warn("KaTeX render error:", e);
        }
      }
    };

    if (window.katex) {
      render();
    } else {
      // Retry loop in case script loads asynchronously
      interval = setInterval(() => {
        if (window.katex) {
          render();
          clearInterval(interval);
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [children, displayMode]);

  return (
    <span 
      ref={containerRef} 
      className={`inline-block ${className}`}
      // Use a subtle fade-in or placeholder to prevent layout jumps
      style={{ minHeight: '1em' }}
    >
      {!rendered && <span className="opacity-50 font-serif italic">{children.replace(/[\$\\]/g, '')}</span>}
    </span>
  );
};

export default Latex;