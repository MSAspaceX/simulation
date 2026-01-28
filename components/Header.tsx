import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    katex: any;
  }
}

const Header: React.FC = () => {
  const mathRef = useRef<HTMLDivElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const renderMath = () => {
      if (window.katex && mathRef.current) {
        try {
          window.katex.render(
            "\\displaystyle y_{\\text{total}} = \\sum A_i \\cos(k_i r_i - \\omega_i t + \\phi_i)", 
            mathRef.current, 
            {
              throwOnError: false,
              displayMode: false, // Keep it inline-block but use displaystyle for size
              color: '#e2e8f0' // Tailwind slate-200
            }
          );
          setIsRendered(true);
        } catch (e) {
          console.error("KaTeX rendering error:", e);
        }
      }
    };

    // Attempt to render immediately
    renderMath();

    // Robust retry mechanism in case script is still loading
    if (!window.katex) {
      interval = setInterval(() => {
        if (window.katex) {
          renderMath();
          clearInterval(interval);
        }
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <header className="px-6 py-5 border-b border-slate-800 bg-slate-900 flex justify-between items-center z-10 shrink-0 shadow-sm select-none">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
          Wave Interference Lab
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          IB Physics &bull; Superposition Principle
        </p>
      </div>
      <div className="hidden md:block">
        <div 
          ref={mathRef} 
          className="text-lg px-6 py-3 bg-slate-800/40 rounded-xl border border-slate-700/50 shadow-inner min-w-[280px] min-h-[60px] flex items-center justify-center text-slate-200"
          aria-label="Wave Equation"
        >
          {/* Visible fallback prevents "deleted" look if JS is slow */}
          {!isRendered && (
            <span className="font-mono text-sm text-slate-500 animate-pulse">
              y_total = Σ A cos(kr - ωt + φ)
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;