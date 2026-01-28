import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SimulationCanvas from './components/SimulationCanvas';
import SourceControl from './components/SourceControl';
import Latex from './components/Latex';
import { WaveSource } from './types';

// Lucide icons are not standard in the requested stack, but I will simulate them with text or SVGs if needed.
// For this strict output, I will use simple SVG elements inline to avoid dependency issues.

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);

const ResetIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
);


const App: React.FC = () => {
  const [paused, setPaused] = useState(false);
  
  // Initial positions are typically centered horizontally, spaced vertically or horizontally
  // Let's place them apart horizontally on a hypothetical 600x600 canvas
  const [source1, setSource1] = useState<WaveSource>({
    id: 1,
    x: 200, 
    y: 300,
    amplitude: 5,
    frequency: 1.5,
    phase: 0,
    active: true,
  });

  const [source2, setSource2] = useState<WaveSource>({
    id: 2,
    x: 400,
    y: 300,
    amplitude: 5,
    frequency: 1.5,
    phase: 0,
    active: true,
  });

  const handleReset = useCallback(() => {
    setSource1({ ...source1, amplitude: 5, frequency: 1.5, phase: 0, active: true });
    setSource2({ ...source2, amplitude: 5, frequency: 1.5, phase: 0, active: true });
    setPaused(false);
  }, [source1, source2]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* Controls Sidebar */}
        <aside className="w-full lg:w-96 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto z-10 shadow-xl custom-scrollbar">
          <div className="flex items-center space-x-4 mb-8">
             <button
              onClick={() => setPaused(!paused)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                paused 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/50 hover:bg-amber-500/20 shadow-amber-900/10' 
                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 hover:bg-emerald-500/20 shadow-emerald-900/10'
              }`}
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
              <span>{paused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700 shadow-md hover:shadow-lg"
              title="Reset Parameters"
            >
              <ResetIcon />
            </button>
          </div>

          <SourceControl 
            title="Source 1"
            source={source1} 
            onChange={setSource1} 
            accentColor="sky"
          />
          
          <SourceControl 
            title="Source 2"
            source={source2} 
            onChange={setSource2} 
            accentColor="indigo"
          />

          <div className="mt-8 p-4 bg-slate-800/40 rounded-xl text-xs text-slate-500 border border-slate-800/50">
             <h4 className="font-semibold text-slate-400 mb-2 uppercase tracking-wide">Physics Notes</h4>
             <ul className="list-disc list-inside space-y-1.5 opacity-80">
                <li><Latex>{"\\lambda = v/f"}</Latex>: Higher freq = shorter waves.</li>
                <li>Phase shift changes interference pattern location.</li>
                <li>Red dots indicate source locations.</li>
             </ul>
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 bg-black relative flex items-center justify-center p-4 lg:p-8">
           <div className="w-full max-w-2xl aspect-square relative shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-800/50">
             <SimulationCanvas 
               sources={[source1, source2]} 
               paused={paused}
             />
             
             {/* Overlay Labels */}
             <div className="absolute top-4 left-4 pointer-events-none bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/10">
                 <div className="flex items-center gap-2 mb-1.5">
                     <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div>
                     <span className="text-xs text-white/90 font-medium">Crest (+A)</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 bg-black border border-white/30 rounded-full"></div>
                     <span className="text-xs text-white/90 font-medium">Trough (-A)</span>
                 </div>
             </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;