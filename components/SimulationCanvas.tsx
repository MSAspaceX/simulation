import React, { useEffect, useRef } from 'react';
import { WaveSource } from '../types';

// We need to declare the p5 type on window since we are loading it via CDN
declare global {
  interface Window {
    p5: any;
  }
}

interface SimulationCanvasProps {
  sources: WaveSource[];
  paused: boolean;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ sources, paused }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any>(null);
  
  // Ref to hold latest props for the p5 draw loop to access without re-binding
  const propsRef = useRef({ sources, paused });

  useEffect(() => {
    propsRef.current = { sources, paused };
  }, [sources, paused]);

  useEffect(() => {
    if (!containerRef.current || !window.p5) return;

    const sketch = (p: any) => {
      // Physics Constants
      const WAVE_SPEED = 100; // pixels per second
      
      // Cache for performance
      let cols: number;
      let rows: number;
      const scale = 4; // Calculate physics on a smaller grid, then upscale

      p.setup = () => {
        const width = containerRef.current?.clientWidth || 500;
        const height = containerRef.current?.clientHeight || 500;
        
        p.createCanvas(width, height);
        p.pixelDensity(1);
        p.frameRate(30); // Cap framerate for performance

        cols = Math.floor(width / scale);
        rows = Math.floor(height / scale);
      };

      p.windowResized = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        p.resizeCanvas(width, height);
        cols = Math.floor(width / scale);
        rows = Math.floor(height / scale);
      };

      p.draw = () => {
        const { sources, paused } = propsRef.current;

        if (!p.simTime) p.simTime = 0;
        if (!paused) {
            p.simTime += p.deltaTime / 1000;
        }

        const t = p.simTime;

        p.background(0);
        p.loadPixels();

        // Performance optimization: Direct pixel array manipulation
        // We iterate over a downscaled grid
        
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const actualX = x * scale;
            const actualY = y * scale;

            let totalDisplacement = 0;
            let maxTotalAmplitude = 0;

            for (const source of sources) {
              if (!source.active) continue;

              maxTotalAmplitude += source.amplitude;

              // Distance from source to point
              const dx = actualX - source.x;
              const dy = actualY - source.y;
              const r = Math.sqrt(dx * dx + dy * dy);

              // Wave Physics
              const lambda = (WAVE_SPEED / source.frequency); 
              const k = (2 * Math.PI) / lambda;
              const omega = 2 * Math.PI * source.frequency;

              // y = A * cos(kr - wt + phi)
              const displacement = source.amplitude * Math.cos(k * r - omega * t + source.phase);
              totalDisplacement += displacement;
            }

            // Map displacement to grayscale color (0-255)
            const normalization = maxTotalAmplitude > 0 ? maxTotalAmplitude : 1;
            
            // Normalize to -1 to 1 range, then map to 0-255
            const normVal = totalDisplacement / normalization;
            const col = Math.floor((normVal + 1) * 127.5);

            // Fill the scaled block of pixels
            for (let sy = 0; sy < scale; sy++) {
                for (let sx = 0; sx < scale; sx++) {
                    const px = (x * scale + sx);
                    const py = (y * scale + sy);
                    
                    if (px < p.width && py < p.height) {
                        const index = (px + py * p.width) * 4;
                        p.pixels[index] = col;     // R
                        p.pixels[index + 1] = col; // G
                        p.pixels[index + 2] = col; // B
                        p.pixels[index + 3] = 255; // Alpha
                    }
                }
            }
          }
        }

        p.updatePixels();

        // Draw Source Indicators with updated colors
        p.strokeWeight(2);
        p.noFill();
        
        sources.forEach((source, index) => {
            if(source.active) {
                // S1 = Sky Blue (rgb(56, 189, 248)), S2 = Indigo (rgb(129, 140, 248))
                if (index === 0) p.stroke(56, 189, 248);
                else p.stroke(129, 140, 248);

                // Pulsing effect
                const pulse = 10 + Math.sin(p.frameCount * 0.1) * 2;
                p.circle(source.x, source.y, pulse);
                
                p.noStroke();
                p.fill(index === 0 ? [56, 189, 248] : [129, 140, 248]);
                p.textSize(12);
                p.text(`S${source.id}`, source.x + 10, source.y - 10);
            }
        });
      };
    };

    p5InstanceRef.current = new window.p5(sketch, containerRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-lg overflow-hidden border border-slate-700 bg-black relative"
    >
        {/* Overlay for instructions if needed, currently clean */}
    </div>
  );
};

export default SimulationCanvas;