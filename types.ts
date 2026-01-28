export interface WaveSource {
  id: number;
  x: number;
  y: number;
  amplitude: number; // 0.1 to 10
  frequency: number; // 0.5 to 5.0 Hz
  phase: number; // 0 to 2*PI
  active: boolean;
}

export interface SimulationConfig {
  waveSpeed: number; // pixels per second
  resolution: number; // Optimization: calculate every Nth pixel
}