import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type BasicOscillatorType = "sawtooth" | "sine" | "square" | "triangle";

export const isBasicOscillatorType = (type: string): type is BasicOscillatorType => {
  return (
    type === "sine" ||
    type === "square" ||
    type === "sawtooth" ||
    type === "triangle"
  )
}

interface ContextProps {
  audioCtx: AudioContext | null,
  setAudioCtx: (ctx: AudioContext | null) => void;
  oscillator: OscillatorNode | null,
  setOscillator: (osc: OscillatorNode | null) => void,
  gain: GainNode | null,
  setGain: (gain: GainNode | null) => void,

  initAudio: () => void,
  oscillatorSetType: (type: OscillatorType) => void,
}

const SynthContext = createContext<ContextProps>({
  audioCtx: null,
  setAudioCtx: () => {},
  oscillator: null,
  setOscillator: () => {},
  gain: null,
  setGain: () => {},

  initAudio: () => {},
  oscillatorSetType: () => {},
});


interface Props {
  children: ReactNode;
}

export const SynthProvider = ({ children }: { children: ReactNode }) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null)
  const [gain, setGain] = useState<GainNode | null>(null)

  const initAudio = () => {
    console.log("start init osc");
    setAudioCtx(new AudioContext());
    console.log("ctx.audioCtx");
    console.log(audioCtx);
    if (!audioCtx) { return }

    setOscillator(new OscillatorNode(audioCtx));
    setGain(new GainNode(audioCtx));

    if (!oscillator || !gain) { return }

    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.start();

    let bpm = 120;
    let note_length = 60 / bpm;
    for (let n = 0; n < 16; n++) {
      // 音の開始・終了時間を計算する
      let start_time = n * note_length;
      let end_time = start_time + 0.1;
      // gain (音量)を時間指定で設定することで鳴らしたり止めたりする
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime + start_time);
      gain.gain.setValueAtTime(0.0, audioCtx.currentTime + end_time);
      // 小節の最初の音だけ高くする
      if (n % 4 == 0) {
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + start_time);
      } else {
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime + start_time);
      }
    }
    console.log("done init osc");
  }

  const oscillatorSetType = (type: OscillatorType) => {
    if (oscillator) { oscillator.type = type; }
  }

  return (
    <SynthContext.Provider
      value={{
        audioCtx,
        setAudioCtx,
        oscillator,
        setOscillator,
        gain,
        setGain,
        initAudio,
        oscillatorSetType
      }}
    >
      {children}
    </SynthContext.Provider>
    )
}

const EditorProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useContext(SynthContext);

  useEffect(() => {

    console.log("start init osc");
    ctx.setAudioCtx(new AudioContext());
    console.log("ctx.audioCtx");
    console.log(ctx.audioCtx);
    if (!ctx.audioCtx) { return }

    ctx.setOscillator(new OscillatorNode(ctx.audioCtx));
    ctx.setGain(new GainNode(ctx.audioCtx));

    if (!ctx.oscillator || !ctx.gain) { return }

    ctx.gain.gain.value = 0;
    ctx.oscillator.connect(ctx.gain);
    ctx.gain.connect(ctx.audioCtx.destination);
    ctx.oscillator.start();

    let bpm = 120;
    let note_length = 60 / bpm;
    for (let n = 0; n < 16; n++) {
      // 音の開始・終了時間を計算する
      let start_time = n * note_length;
      let end_time = start_time + 0.1;
      // gain (音量)を時間指定で設定することで鳴らしたり止めたりする
      ctx.gain.gain.setValueAtTime(0.4, ctx.audioCtx.currentTime + start_time);
      ctx.gain.gain.setValueAtTime(0.0, ctx.audioCtx.currentTime + end_time);
      // 小節の最初の音だけ高くする
      if (n % 4 == 0) {
        ctx.oscillator.frequency.setValueAtTime(880, ctx.audioCtx.currentTime + start_time);
      } else {
        ctx.oscillator.frequency.setValueAtTime(440, ctx.audioCtx.currentTime + start_time);
      }
    }
    console.log("done init osc");

  }, [])

  return <SynthProvider>{children}</SynthProvider>;
};

export const useSynth = () => useContext(SynthContext);
