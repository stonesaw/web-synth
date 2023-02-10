import { ReactNode, createContext, useContext, useState } from "react";

import { clamp, noteNumberToFrequency, percentToFrequency } from "@/libs/utils";
import { BasicOscillatorType, FILTER_FREQ_MAX, FILTER_FREQ_MIN, PropertyMatrix } from "@/types/synth";

interface SynthContextProps {
  audioCtx: AudioContext | null;
  setAudioCtx: (audioCtx: AudioContext | null) => void;
  oscillatorNode: OscillatorNode | null;
  setOscillatorNode: (oscillatorNode: OscillatorNode | null) => void;
  subOscillatorNode: OscillatorNode | null;
  setSubOscillatorNode: (subOscillatorNode: OscillatorNode | null) => void;
  ampNode: GainNode | null;
  setAmpNode: (ampNode: GainNode | null) => void;
  oscillatorGainNode: GainNode | null;
  setOscillatorGainNode: (oscillatorGainNode: GainNode | null) => void;
  subOscillatorGainNode: GainNode | null;
  setSubOscillatorGainNode: (subOscillatorGainNode: GainNode | null) => void;
  filter1Node: BiquadFilterNode | null;
  setFilter1Node: (filter1Node:BiquadFilterNode | null) => void;
  filter2Node: BiquadFilterNode | null;
  setFilter2Node: (filter2Node:BiquadFilterNode | null) => void;
  compressorNode: DynamicsCompressorNode | null;
  setCompressorNode: (compressorNode: DynamicsCompressorNode | null) => void;
  analyserNode: AnalyserNode | null;
  setAnalyserNode: (analyserNode:AnalyserNode | null) => void;
  analyzeData: Uint8Array;
  setAnalyzeData: (analyzeData: Uint8Array) => void;
  intervalID: number | null;
  setIntervalID: (intervalID: number | null) => void;
  intervalIDs: number | null[];
  setIntervalIDs: (intervalIDs: number | null[]) => void;
  intervalCount: number;
  setIntervalCount: (intervalCount: number) => void;
  isStop: boolean;
  setIsStop: (isStop: boolean) => void;
  // osc1
  type: BasicOscillatorType;
  setType: (type: BasicOscillatorType) => void;
  osc1Gain: number;
  setOsc1Gain: (osc1Gain: number) => void;
  osc1Semi: number;
  setOsc1Semi: (osc1Semi: number) => void;
  osc1Detune: number;
  setOsc1Detune: (osc1Detune: number) => void;
  // sub
  subOsc: boolean;
  setSubOsc: (subOsc: boolean) => void;
  subOscGain: number;
  setSubOscGain: (subOscGain: number) => void;
  subOscOctave: number;
  setSubOscOctave: (subOscOctave: number) => void;
  subOscTranspose: number;
  setSubOscTranspose: (subOscTranspose: number) => void;
  subOscType: "sync" | BasicOscillatorType;
  setSubOscType: (subOscType: "sync" | BasicOscillatorType) => void;
  // filter1
  filter1: boolean;
  setFilter1: (filter1: boolean) => void;
  filter1Type: BiquadFilterType;
  setFilter1Type: (filter1Type: BiquadFilterType) => void;
  filter1Freq: number;
  setFilter1Freq: (filter1Freq: number) => void;
  filter1Q: number;
  setFilter1Q: (filter1Q: number) => void;
  filter1Gain: number;
  setFilter1Gain: (filter1Gain: number) => void;
  // filter2
  filter2: boolean;
  setFilter2: (filter2: boolean) => void;
  filter2Type: BiquadFilterType;
  setFilter2Type: (filter2Type: BiquadFilterType) => void;
  filter2Freq: number;
  setFilter2Freq: (filter2Freq: number) => void;
  filter2Q: number;
  setFilter2Q: (filter2Q: number) => void;
  filter2Gain: number;
  setFilter2Gain: (filter2Gain: number) => void;
  // amp
  attack: number;
  setAttack: (attack: number) => void;
  decay: number;
  setDecay: (decay: number) => void;
  sustain: number;
  setSustain: (sustain: number) => void;
  release: number;
  setRelease: (release: number) => void;
  // env1
  env1Attack: number;
  setEnv1Attack: (attack: number) => void;
  env1Decay: number;
  setEnv1Decay: (decay: number) => void;
  env1Sustain: number;
  setEnv1Sustain: (sustain: number) => void;
  env1Release: number;
  setEnv1Release: (release: number) => void;
  // env2
  env2Attack: number;
  setEnv2Attack: (attack: number) => void;
  env2Decay: number;
  setEnv2Decay: (decay: number) => void;
  env2Sustain: number;
  setEnv2Sustain: (sustain: number) => void;
  env2Release: number;
  setEnv2Release: (release: number) => void;
  // matrix
  propertyMatrix: PropertyMatrix;
  setPropertyMatrix: (propertyMatrix: PropertyMatrix) => void;
  initAudio: () => void;
  startAmp: (noteNumber: number) => void;
  stopAmp: () => void;
}

const SynthContext = createContext<SynthContextProps>({
  audioCtx: null,
  setAudioCtx: () => undefined,
  oscillatorNode: null,
  setOscillatorNode: () => undefined,
  subOscillatorNode: null,
  setSubOscillatorNode: () => undefined,
  ampNode: null,
  setAmpNode: () => undefined,
  oscillatorGainNode: null,
  setOscillatorGainNode: () => undefined,
  subOscillatorGainNode: null,
  setSubOscillatorGainNode: () => undefined,
  filter1Node: null,
  setFilter1Node: () => undefined,
  filter2Node: null,
  setFilter2Node: () => undefined,
  compressorNode: null,
  setCompressorNode: () => undefined,
  analyserNode: null,
  setAnalyserNode: () => undefined,
  analyzeData: new Uint8Array(1024),
  setAnalyzeData: () => undefined,
  intervalID: null,
  setIntervalID: () => undefined,
  intervalIDs: 0,
  setIntervalIDs: () => undefined,
  intervalCount: 0,
  setIntervalCount: () => undefined,
  isStop: false,
  setIsStop: () => undefined,
  type: "sine",
  setType: () => undefined,
  osc1Gain: 0,
  setOsc1Gain: () => undefined,
  osc1Semi: 0,
  setOsc1Semi: () => undefined,
  osc1Detune: 0,
  setOsc1Detune: () => undefined,
  subOsc: false,
  setSubOsc: () => undefined,
  subOscGain: 0,
  setSubOscGain: () => undefined,
  subOscOctave: 0,
  setSubOscOctave: () => undefined,
  subOscTranspose: 0,
  setSubOscTranspose: () => undefined,
  subOscType: "sine",
  setSubOscType: () => undefined,
  filter1: false,
  setFilter1: () => undefined,
  filter1Type: "allpass",
  setFilter1Type: () => undefined,
  filter1Freq: 0,
  setFilter1Freq: () => undefined,
  filter1Q: 0,
  setFilter1Q: () => undefined,
  filter1Gain: 0,
  setFilter1Gain: () => undefined,
  filter2: false,
  setFilter2: () => undefined,
  filter2Type: "allpass",
  setFilter2Type: () => undefined,
  filter2Freq: 0,
  setFilter2Freq: () => undefined,
  filter2Q: 0,
  setFilter2Q: () => undefined,
  filter2Gain: 0,
  setFilter2Gain: () => undefined,
  attack: 0,
  setAttack: () => undefined,
  decay: 0,
  setDecay: () => undefined,
  sustain: 0,
  setSustain: () => undefined,
  release: 0,
  setRelease: () => undefined,
  env1Attack: 0,
  setEnv1Attack: () => undefined,
  env1Decay: 0,
  setEnv1Decay: () => undefined,
  env1Sustain: 0,
  setEnv1Sustain: () => undefined,
  env1Release: 0,
  setEnv1Release: () => undefined,
  env2Attack: 0,
  setEnv2Attack: () => undefined,
  env2Decay: 0,
  setEnv2Decay: () => undefined,
  env2Sustain: 0,
  setEnv2Sustain: () => undefined,
  env2Release: 0,
  setEnv2Release: () => undefined,
  propertyMatrix: {
    "Sub Gain": {},
    "Sub Transpose": {},
    "OSC1 Gain": {},
    "filter1 Freq": { "ENV1": 34 },
    "filter1 Gain": {},
    "filter1 Q": {},
    "filter2 Freq": {},
    "filter2 Gain": {},
    "filter2 Q": {},
  },
  setPropertyMatrix: () => undefined,
  initAudio: () => undefined,
  startAmp: () => undefined,
  stopAmp: () => undefined
});

interface Props {
  children: ReactNode;
}

export const SynthProvider = ({ children }: Props) => {
  // web audio api
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillatorNode, setOscillatorNode] = useState<OscillatorNode | null>(null);
  const [subOscillatorNode, setSubOscillatorNode] = useState<OscillatorNode | null>(null);
  const [ampNode, setAmpNode] = useState<GainNode | null>(null);
  const [oscillatorGainNode, setOscillatorGainNode] = useState<GainNode | null>(null);
  const [subOscillatorGainNode, setSubOscillatorGainNode] = useState<GainNode | null>(null);
  const [filter1Node, setFilter1Node] = useState<BiquadFilterNode | null>(null);
  const [filter2Node, setFilter2Node] = useState<BiquadFilterNode | null>(null);
  const [compressorNode, setCompressorNode] = useState<DynamicsCompressorNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [analyzeData, setAnalyzeData] = useState<Uint8Array>(new Uint8Array(1024));
  const [intervalID, setIntervalID] = useState<number | null>(null);
  const [intervalIDs, setIntervalIDs] = useState<number | null[]>([]);
  const [intervalCount, setIntervalCount] = useState<number>(0);
  const [isStop, setIsStop] = useState<boolean>(true);

  // osc1
  const [type, setType] = useState<BasicOscillatorType>("sine");
  const [osc1Gain, setOsc1Gain] = useState<number>(100); // TODO: とりあえず 0 ~ 100 %
  const [osc1Semi, setOsc1Semi] = useState<number>(0);
  const [osc1Detune, setOsc1Detune] = useState<number>(0);

  // subOsc
  const [subOsc, setSubOsc] = useState<boolean>(false);
  const [subOscGain, setSubOscGain] = useState<number>(50);
  const [subOscOctave, setSubOscOctave] = useState<number>(-1);
  const [subOscTranspose, setSubOscTranspose] = useState<number>(0); // -48 ~ 48 (st)
  const [subOscType, setSubOscType] = useState<"sync" | BasicOscillatorType>("sync");

  // filter1
  const [filter1, setFilter1] = useState<boolean>(true);
  const [filter1Type, setFilter1Type] = useState<BiquadFilterType>("lowpass");
  const [filter1Freq, setFilter1Freq] = useState<number>(8000); // 0 ~ 20.5k
  const [filter1Q, setFilter1Q] = useState<number>(5); // 0 ~ 50
  const [filter1Gain, setFilter1Gain] = useState<number>(0); // 0 ~ 50

  // filter2
  const [filter2, setFilter2] = useState<boolean>(false);
  const [filter2Type, setFilter2Type] = useState<BiquadFilterType>("highpass");
  const [filter2Freq, setFilter2Freq] = useState<number>(20); // 0 ~ 20.5k
  const [filter2Q, setFilter2Q] = useState<number>(5); // 0 ~ 50
  const [filter2Gain, setFilter2Gain] = useState<number>(0); // 0 ~ 50

  // amp
  const [attack, setAttack] = useState(100);   // attack (ms)
  const [decay, setDecay] = useState(300);     // decay (ms)
  const [sustain, setSustain] = useState(70); // sustain (%)
  const [release, setRelease] = useState(100); // release (ms)

  // env1
  const [env1Attack, setEnv1Attack] = useState(100);   // attack (ms)
  const [env1Decay, setEnv1Decay] = useState(300);     // decay (ms)
  const [env1Sustain, setEnv1Sustain] = useState(70); // sustain (%)
  const [env1Release, setEnv1Release] = useState(300); // release (ms)

  // env2
  const [env2Attack, setEnv2Attack] = useState(100);   // attack (ms)
  const [env2Decay, setEnv2Decay] = useState(300);     // decay (ms)
  const [env2Sustain, setEnv2Sustain] = useState(70); // sustain (%)
  const [env2Release, setEnv2Release] = useState(300); // release (ms)

  // matrix
  const [propertyMatrix, setPropertyMatrix] = useState<PropertyMatrix>({
    "Sub Gain": {},
    "Sub Transpose": {},
    "OSC1 Gain": {},
    "filter1 Freq": {"ENV1": 34},
    "filter1 Gain": {},
    "filter1 Q": {},
    "filter2 Freq": {},
    "filter2 Gain": {},
    "filter2 Q": {},
  });

  const initAudio = () => {
    const _audioCtx = new AudioContext({sampleRate: 44100});

    setAudioCtx(_audioCtx);
    setOscillatorNode(new OscillatorNode(_audioCtx));
    setSubOscillatorNode(new OscillatorNode(_audioCtx));
    setOscillatorGainNode(new GainNode(_audioCtx));
    setSubOscillatorGainNode(new GainNode(_audioCtx));
    setAmpNode(new GainNode(_audioCtx));
    const _filter1 = new BiquadFilterNode(_audioCtx);
    setFilter1Node(_filter1);
    setFilter2Node(new BiquadFilterNode(_audioCtx));
    setCompressorNode(new DynamicsCompressorNode(_audioCtx));
    const _analyzer = new AnalyserNode(_audioCtx);
    setAnalyserNode(_analyzer);

    // setInterval(() => {
    //   _analyzer.getByteFrequencyData(analyzeData);
    //   for (let i = 0; i < 1024; i++) {
    //     if (analyzeData[i] != 0) {
    //       console.log(i, analyzeData[i]);
    //     }
    //   }
    // }, 100)

    console.log(_audioCtx);
    console.log("done: init audio");
  };

  // noteNumber: e.g. C4 = 60
  const startAmp = (noteNumber: number) => {
    if (!audioCtx) { initAudio(); }
    if (!audioCtx||
        !oscillatorNode ||
        !subOscillatorNode ||
        !oscillatorGainNode ||
        !subOscillatorGainNode ||
        !ampNode ||
        !filter1Node ||
        !filter2Node ||
        !compressorNode ||
        !analyserNode) {
      console.error("error: Can't use Audio Context!");
      return;
    }
    if (!isStop) {
      oscillatorNode.stop(0);
      subOscillatorNode.stop(0);
    }

    const _oscillator = new OscillatorNode(audioCtx);
    const _sub = new OscillatorNode(audioCtx);

    // set parameter at state
    _oscillator.type = type;
    _oscillator.detune.value = osc1Detune;
    oscillatorGainNode.gain.value = clamp(osc1Gain / 100);

    _sub.type = subOscType == "sync" ? type : subOscType;
    subOscillatorGainNode.gain.value = clamp(subOscGain / 100);

    filter1Node.type = filter1 ? filter1Type : "allpass";
    filter1Node.frequency.value = filter1Freq;
    filter1Node.Q.value = filter1Q;
    filter1Node.gain.value = filter1Gain;

    filter2Node.type = filter2 ? filter2Type : "allpass";
    filter2Node.frequency.value = filter2Freq;
    filter2Node.Q.value = filter2Q;
    filter2Node.gain.value = filter2Gain;

    // audio connection tree
    _oscillator.connect(oscillatorGainNode).connect(ampNode);
    if (subOsc) {
      _sub.connect(subOscillatorGainNode).connect(ampNode);
    }

    ampNode.connect(filter1Node)
           .connect(filter2Node)
           .connect(compressorNode)
           .connect(analyserNode)
           .connect(audioCtx.destination);

    // ADSR
    const t0 = audioCtx.currentTime;
    _oscillator.start(t0);
    _sub.start(t0);
    ampNode.gain.setValueAtTime(0, t0);
    const t1      = t0 + attack / 1000;  // (at start) + (attack time)
    const t2      = decay / 1000;
    const t2Value = sustain / 100;

    ampNode.gain.linearRampToValueAtTime(1, t1);
    ampNode.gain.setTargetAtTime(t2Value, t1, t2);
    setIsStop(false);

    if (propertyMatrix["filter1 Freq"]["ENV1"]) {
      const percent = propertyMatrix["filter1 Freq"]["ENV1"] / 100;
      const modFreq = percentToFrequency(percent);

      // TODO: - だったときの考慮

      filter1Node.frequency.setValueAtTime(filter1Freq, t0);
      const t1      = t0 + env1Attack / 1000;  // (at start) + (attack time)
      const t2      = env1Decay / 1000;
      const t2Value = env1Sustain / 100;

      filter1Node.frequency.linearRampToValueAtTime(clamp(filter1Freq + modFreq, FILTER_FREQ_MIN, FILTER_FREQ_MAX), t1);
      filter1Node.frequency.setTargetAtTime(percentToFrequency(t2Value), t1, t2);
    }

    // tone
    const f = noteNumberToFrequency(noteNumber + osc1Semi);
    _oscillator.frequency.setValueAtTime(f, audioCtx.currentTime);

    if (subOsc) {
      const sub_f = noteNumberToFrequency(noteNumber + osc1Semi + subOscOctave * 12 + subOscTranspose);
      _sub.frequency.setValueAtTime(sub_f, audioCtx.currentTime);
    }

    setOscillatorNode(_oscillator);
    setSubOscillatorNode(_sub);
  };

  const stopAmp = () => {
    if (!audioCtx || !oscillatorNode || !subOscillatorNode || !ampNode || !filter1Node) { return; }
    if (isStop) { return; }

    const t3 = audioCtx.currentTime;
    const t4 = release / 1000;
    ampNode.gain.cancelScheduledValues(t3);
    ampNode.gain.setValueAtTime(ampNode.gain.value, t3);
    ampNode.gain.setTargetAtTime(0, t3, t4);  // Release
    setIntervalID(window.setInterval(function() {
      const VALUE_OF_STOP = 1e-3;
      if (ampNode.gain.value < VALUE_OF_STOP) {
        oscillatorNode.stop(0);
        subOscillatorNode.stop(0);
        if (intervalID !== null) {
          window.clearInterval(intervalID);
          setIntervalID(null);
        }
        setIsStop(true);
      }
    }, 0));

    // if (propertyMatrix["filter1 Freq"]["ENV1"]) {
    //   const t3 = audioCtx.currentTime;
    //   const t4 = env1Release / 1000;
    //   filter1Node.frequency.cancelScheduledValues(t3);
    //   filter1Node.frequency.setValueAtTime(filter1Node.frequency.value, t3);
    //   filter1Node.frequency.setTargetAtTime(0, t3, t4);  // Release
    //   const i = intervalCount + 1;
    //   const ids = [...intervalIDs];
    //   const id = window.setInterval(function() {
    //     const VALUE_OF_STOP = 1e-3;
    //     if (ampNode.gain.value < VALUE_OF_STOP) {
    //       oscillatorNode.stop(0);
    //       subOscillatorNode.stop(0);
    //       if (ids[i] !== null) {
    //         window.clearInterval(ids[i]);

    //         setIntervalIDs(null);
    //       }
    //       setIsStop(true);
    //     }
    //   }, 0);
    //   ids[i] = id;
    //   setIntervalIDs(ids);
    //   setIntervalCount(i);
    // }
  };

  return (
    <SynthContext.Provider
      value={{
        audioCtx,
        setAudioCtx,
        oscillatorNode,
        setOscillatorNode,
        subOscillatorNode,
        setSubOscillatorNode,
        ampNode,
        setAmpNode,
        oscillatorGainNode,
        setOscillatorGainNode,
        subOscillatorGainNode,
        setSubOscillatorGainNode,
        filter1Node,
        setFilter1Node,
        filter2Node,
        setFilter2Node,
        compressorNode,
        setCompressorNode,
        analyserNode,
        setAnalyserNode,
        analyzeData,
        setAnalyzeData,
        intervalID,
        setIntervalID,
        intervalIDs,
        setIntervalIDs,
        intervalCount,
        setIntervalCount,
        isStop,
        setIsStop,
        // osc1
        type,
        setType,
        osc1Gain,
        setOsc1Gain,
        osc1Semi,
        setOsc1Semi,
        osc1Detune,
        setOsc1Detune,
        // sub
        subOsc,
        setSubOsc,
        subOscGain,
        setSubOscGain,
        subOscOctave,
        setSubOscOctave,
        subOscTranspose,
        setSubOscTranspose,
        subOscType,
        setSubOscType,
        // filter1
        filter1,
        setFilter1,
        filter1Type,
        setFilter1Type,
        filter1Freq,
        setFilter1Freq,
        filter1Q,
        setFilter1Q,
        filter1Gain,
        setFilter1Gain,
        // filter2
        filter2,
        setFilter2,
        filter2Type,
        setFilter2Type,
        filter2Freq,
        setFilter2Freq,
        filter2Q,
        setFilter2Q,
        filter2Gain,
        setFilter2Gain,
        // amp
        attack,
        setAttack,
        decay,
        setDecay,
        sustain,
        setSustain,
        release,
        setRelease,
        // env1
        env1Attack,
        setEnv1Attack,
        env1Decay,
        setEnv1Decay,
        env1Sustain,
        setEnv1Sustain,
        env1Release,
        setEnv1Release,
        // env2
        env2Attack,
        setEnv2Attack,
        env2Decay,
        setEnv2Decay,
        env2Sustain,
        setEnv2Sustain,
        env2Release,
        setEnv2Release,
        // matrix
        propertyMatrix,
        setPropertyMatrix,
        // logic function
        initAudio,
        startAmp,
        stopAmp
      }}
    >
      {children}
    </SynthContext.Provider>
    );
};

export const useSynth = () => useContext(SynthContext);
