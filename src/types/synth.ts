// oscillator
export type BasicOscillatorType =  "sine" | "triangle" | "sawtooth" | "square";

export const isBasicOscillatorType = (type: string): type is BasicOscillatorType => {
  return (
    type === "sine" ||
    type === "square" ||
    type === "sawtooth" ||
    type === "triangle"
  );
};

// filter
// https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode

export const isBiquadFilterType = (type: string): type is BiquadFilterType => {
  return (
    type === "lowpass" ||
    type === "highpass" ||
    type === "bandpass" ||
    type === "lowshelf" ||
    type === "highshelf" ||
    type === "peaking" ||
    type === "notch" ||
    type === "allpass"
  );
};

export const FILTER_FREQ_MAX = 20500;
export const FILTER_FREQ_MIN = 10;

export const DEFAULT_Q_MAX = 20;
export const DEFAULT_Q_MIN = -20;
export const DEFAULT_GAIN_MAX = 30;
export const DEFAULT_GAIN_MIN = -30;

export const filterQGainUsedFlags: {
  [key in BiquadFilterType]: {
    "Q": boolean,
    "GAIN": boolean,
    "Q_RANGE"?: {"MAX": number, "MIN": number},
    "GAIN_RANGE"?: {"MAX": number, "MIN": number},
  }
}
= {
  "lowpass": {
    "Q": true,
    "GAIN": false
  },
  "highpass": {
    "Q": true,
    "GAIN": false
  },
  "bandpass": {
    "Q": true,
    "GAIN": false,
    "Q_RANGE": {"MAX": DEFAULT_Q_MAX, "MIN": 0},
  },
  "lowshelf": {
    "Q": false,
    "GAIN": true
  },
  "highshelf": {
    "Q": false,
    "GAIN": true
  },
  "peaking": {
    "Q": true,
    "GAIN": true,
    "Q_RANGE": {"MAX": DEFAULT_Q_MAX, "MIN": 0},
  },
  "notch": {
    "Q": true,
    "GAIN": false
  },
  "allpass": {
    "Q": true,
    "GAIN": false
  },
};

// modulations (amp, env)

export const ATTACK_MIN_MS = 5;
export const ATTACK_MAX_MS = 20000;

export const modulations = ["AMP", "ENV1", "ENV2", "LFO1", "LFO2"] as const;
export type modulationsType = typeof modulations[number];

export const AssignableParams = [
  "Sub Gain",
  "Sub Transpose",
  "OSC1 Gain",
  "filter1 Freq",
  "filter1 Gain",
  "filter1 Q",
  "filter2 Freq",
  "filter2 Gain",
  "filter2 Q",
] as const;
export type AssignableParamsType = typeof AssignableParams[number];

export type PropertyMatrix = {
  [key in AssignableParamsType]: { "AMP"?: number; "ENV1"?: number; "ENV2"?: number; "LFO1"?: number; "LFO2"?: number; };
};

// export type PropertyMatrix = Map<AssignableParamsType, Map<modulationsType, number | null>>;

export const KeyboardScales = ["chromatic", "major", "minor", "major pentatonic", "minor pentatonic"] as const;
export type KeyboardScale = typeof KeyboardScales[number];
