import React from 'react';
import { WaveSource } from '../types';
import Latex from './Latex';

interface SourceControlProps {
  source: WaveSource;
  onChange: (updated: WaveSource) => void;
  title: string;
  accentColor: 'sky' | 'indigo';
}

const SourceControl: React.FC<SourceControlProps> = ({ source, onChange, title, accentColor }) => {
  const handleChange = (field: keyof WaveSource, value: number) => {
    onChange({ ...source, [field]: value });
  };

  // Theme configuration objects
  const themes = {
    sky: {
      accentText: 'text-sky-400',
      accentBg: 'bg-sky-500',
      accentBorder: 'border-sky-500/30',
      slider: 'accent-sky-400',
      toggleOn: 'bg-sky-500',
      glow: 'shadow-sky-500/10'
    },
    indigo: {
      accentText: 'text-indigo-400',
      accentBg: 'bg-indigo-500',
      accentBorder: 'border-indigo-500/30',
      slider: 'accent-indigo-400',
      toggleOn: 'bg-indigo-500',
      glow: 'shadow-indigo-500/10'
    }
  };

  const theme = themes[accentColor];

  return (
    <div 
      className={`
        relative p-5 rounded-2xl mb-6 transition-all duration-300 border
        ${source.active 
          ? `bg-slate-900/80 ${theme.accentBorder} shadow-lg ${theme.glow}` 
          : 'bg-slate-900/40 border-slate-800/50 opacity-70 grayscale-[0.5]'
        }
      `}
    >
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`
            w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-colors duration-300
            ${source.active ? theme.accentBg : 'bg-slate-600'} 
          `} />
          <h3 className={`text-lg font-bold tracking-wide ${source.active ? 'text-slate-100' : 'text-slate-400'}`}>
            {title}
          </h3>
        </div>
        
        {/* Modern Toggle Switch */}
        <button
          onClick={() => onChange({...source, active: !source.active})}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-700
            ${source.active ? theme.toggleOn : 'bg-slate-700'}
          `}
          aria-label={source.active ? "Disable source" : "Enable source"}
        >
          <span 
            className={`
              block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-out
              ${source.active ? 'translate-x-7' : 'translate-x-1'}
            `} 
          />
        </button>
      </div>

      {/* Controls Container */}
      <div className={`space-y-6 ${!source.active ? 'pointer-events-none' : ''}`}>
        
        {/* Amplitude Slider */}
        <div className="group">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                Amplitude
              </label>
              <Latex className="text-slate-400 group-hover:text-slate-300 transition-colors">A</Latex>
            </div>
            <span className={`font-mono text-sm font-medium ${theme.accentText}`}>
              {source.amplitude.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={source.amplitude}
            onChange={(e) => handleChange('amplitude', parseFloat(e.target.value))}
            className={`
              w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer 
              ${theme.slider} 
              hover:bg-slate-700 transition-colors focus:outline-none focus:ring-0
            `}
          />
        </div>

        {/* Frequency Slider */}
        <div className="group">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                Frequency
              </label>
              <Latex className="text-slate-400 group-hover:text-slate-300 transition-colors">f</Latex>
            </div>
            <span className={`font-mono text-sm font-medium ${theme.accentText}`}>
              {source.frequency.toFixed(1)} <span className="text-slate-500 text-xs">Hz</span>
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={source.frequency}
            onChange={(e) => handleChange('frequency', parseFloat(e.target.value))}
            className={`
              w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer 
              ${theme.slider}
              hover:bg-slate-700 transition-colors focus:outline-none
            `}
          />
        </div>

        {/* Phase Slider */}
        <div className="group">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
               <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                Phase
              </label>
              <Latex className="text-slate-400 group-hover:text-slate-300 transition-colors">\phi</Latex>
            </div>
            <span className={`font-mono text-sm font-medium ${theme.accentText}`}>
              <span className="flex items-center gap-1">
                 {(source.phase / Math.PI).toFixed(2)}
                 <Latex className="text-xs">\pi</Latex>
              </span>
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step={Math.PI / 16}
            value={source.phase}
            onChange={(e) => handleChange('phase', parseFloat(e.target.value))}
            className={`
              w-full h-1.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer 
              ${theme.slider}
              hover:bg-slate-700 transition-colors focus:outline-none
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default SourceControl;