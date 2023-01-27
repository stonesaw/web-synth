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
