import { createContext, ReactNode, useContext, useState } from "react";

export const ATTACK_MIN_MS = 5;
export const ATTACK_MAX_MS = 20000;

export type BasicOscillatorType =  "sine" | "triangle" | "sawtooth" | "square";

export const isBasicOscillatorType = (type: string): type is BasicOscillatorType => {
  return (
    type === "sine" ||
    type === "square" ||
    type === "sawtooth" ||
    type === "triangle"
  )
}

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
  )
}

// https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode

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
}

export const getQRange = (filterType: BiquadFilterType, minmax: "MIN" | "MAX") => {
  const qRange = filterQGainUsedFlags[filterType]["Q_RANGE"];
  if (qRange) {
    return qRange[minmax];
  } else {
    return (minmax == "MAX" ? DEFAULT_Q_MAX : DEFAULT_Q_MIN);
  }
}

export const getGainRange = (filterType: BiquadFilterType, minmax: "MIN" | "MAX") => {
  const gainRange = filterQGainUsedFlags[filterType]["GAIN_RANGE"];
  if (gainRange) {
    return gainRange[minmax];
  } else {
    return (minmax == "MAX" ? DEFAULT_GAIN_MAX : DEFAULT_GAIN_MIN);
  }
}


interface SynthContextProps {
  audioCtx: AudioContext | null,
  setAudioCtx: (ctx: AudioContext | null) => void;
  oscillator: OscillatorNode | null,
  setOscillator: (osc: OscillatorNode | null) => void,
  gain: GainNode | null,
  setGain: (gain: GainNode | null) => void,
  // type: BasicOscillatorType,
  // setType: (type: BasicOscillatorType) => void,
  // attack: number,
  // setAttack: (attack: number) => void,
  // decay: number,
  // setDecay: (decay: number) => void,
  // sustain: number,
  // setSustain: (sustain: number) => void,
  // release: number,
  // setRelease: (release: number) => void,
}

const SynthContext = createContext<SynthContextProps>({
  audioCtx: null,
  setAudioCtx: () => {},
  oscillator: null,
  setOscillator: () => {},
  gain: null,
  setGain: () => {},
  // type: "sine",
  // setType: () => undefined,
  // attack: 5,
  // setAttack: (attack: number) => {},
  // decay: 300,
  // setDecay: () => undefined,
  // sustain: 60,
  // setSustain: () => undefined,
  // release: 1000,
  // setRelease: () => undefined,
});

interface Props {
  children: ReactNode;
}

export const SynthProvider = ({ children }: Props) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gain, setGain] = useState<GainNode | null>(null);

  return (
    <SynthContext.Provider
      value={{
        audioCtx,
        setAudioCtx,
        oscillator,
        setOscillator,
        gain,
        setGain,
        // type,
        // setType,
        // attack,
        // setAttack,
        // decay,
        // setDecay,
        // sustain,
        // setSustain,
        // release,
        // setRelease,
      }}
    >
      {children}
    </SynthContext.Provider>
    )
}

export const useSynth = () => useContext(SynthContext);
