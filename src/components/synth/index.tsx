import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  HStack,
  VStack,
  Box,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tooltip,
  Divider,
} from '@chakra-ui/react'
import { QuestionIcon } from '@chakra-ui/icons';

import { theme } from '@/libs/theme'
import { clamp, noteNumberToFrequency } from '@/libs/utils'
import { BasicOscillatorType } from '@/providers/synth';

import { ButtonOnce } from '@/components/synth/ButtonOnce';
import { GainSlider } from '@/components/synth/osc/gainSlider';
import { WaveShapeCanvas } from '@/components/synth/osc/waveShapeCanvas';
import { WaveShapeMenu } from '@/components/synth/osc/waveShapeMenu';
import { OscParams } from '@/components/synth/osc/oscParams';
import { Amp } from '@/components/synth/amp/';
import { FilterMenu } from '@/components/synth/filter/filterMenu';
import { FilterCanvas } from '@/components/synth/filter/filterCanvas';
import { FilterKnobsGroup } from './filter/filterKnobsGroup';
import { Keyboard } from '@/components/synth/keyboard';
import { SubOsc } from '@/components/synth/subOsc';


// 参考
// Amp 実装 ... https://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/envelope-generator
// その他フィルターなど ... https://www.g200kg.com/jp/docs/webaudio/oscillator.html
// https://g200kg.github.io/web-audio-api-ja/#biquadfilternode
// https://webaudioapi.com/samples/frequency-response/


/*
TODO:
- canvas (ADSR) の実装変更 ... eventListener を React Styleに
- canvas (ADSR) の実装変更 ... リファクタリング
- Env 実装 (ADSR) をコピー
- Osc2 実装

*/


const Synth = () => {
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
  const [intervalID, setIntervalID] = useState<any>(null);
  const [isStop, setIsStop] = useState<Boolean>(true);

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
  const [frequencyHz, setFrequencyHz] = useState<Float32Array>(new Float32Array(300));
  const [magResponse, setMagResponse] = useState<Float32Array>(new Float32Array(300));
  const [phaseResponse, setPhaseResponse] = useState<Float32Array>(new Float32Array(300));

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

  const initAudio = () => {
    const _audioCtx = new AudioContext();

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

    // setInterval(() => {
    //   var noctaves = 11;
    //   const w = 300;

    //   let _frequencyHz = new Float32Array(w);
    //   let _magResponse = new Float32Array(w);
    //   let _phaseResponse = new Float32Array(w);
    //   var nyquist = 0.5 * _audioCtx.sampleRate;
    //   // First get response.
    //   for (var i = 0; i < w; ++i) {
    //     var f = i / w;
    //     // Convert to log frequency scale (octaves).
    //     f = nyquist * Math.pow(2.0, noctaves * (f - 1.0));
    //     _frequencyHz[i] = f;
    //   }

    //   _filter1.getFrequencyResponse(_frequencyHz, _magResponse, _phaseResponse);

    //   const eq = () => {
    //     for (let i = 0; i < w; i++) {
    //       if (magResponse[i] === _magResponse[i]) return false;
    //     }
    //     return true;
    //   }
    //   console.log(magResponse[0]);
    //   console.log(_magResponse[0]);
    //   console.log(magResponse[0] === _magResponse[0]);

    //   setFrequencyHz((_frequencyHz) => _frequencyHz);
    //   setMagResponse((_magResponse) => _magResponse);
    //   setPhaseResponse((_phaseResponse) => _phaseResponse);
    // }, 1000)

    console.log("done: init audio");
  }

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

    _oscillator.connect(oscillatorGainNode).connect(ampNode);
    if (subOsc) {
      _sub.connect(subOscillatorGainNode).connect(ampNode);
    }

    // if (filter1 && filter2) {
    //   ampNode.connect(filter1Node)
    //          .connect(filter2Node)
    //          .connect(compressorNode);
    // } else if (filter1) {
    //   ampNode.connect(filter1Node)
    //          .connect(compressorNode);
    // } else if (filter2) {
    //   ampNode.connect(filter2Node)
    //          .connect(compressorNode);
    // } else {
    //   ampNode.connect(compressorNode);
    // }

    ampNode.connect(filter1Node)
           .connect(filter2Node)
           .connect(compressorNode)
           .connect(analyserNode)
           .connect(audioCtx.destination);

    let t0 = audioCtx.currentTime;
    _oscillator.start(t0);
    _sub.start(t0);
    ampNode.gain.setValueAtTime(0, t0);
    let t1      = t0 + attack / 1000;  // (at start) + (attack time)
    let t2      = decay / 1000;
    let t2Value = sustain / 100;

    ampNode.gain.linearRampToValueAtTime(1, t1);
    ampNode.gain.setTargetAtTime(t2Value, t1, t2);
    setIsStop(false);

    const f = noteNumberToFrequency(noteNumber + osc1Semi);
    _oscillator.frequency.setValueAtTime(f, audioCtx.currentTime);

    if (subOsc) {
      const sub_f = noteNumberToFrequency(noteNumber + osc1Semi + subOscOctave * 12 + subOscTranspose);
      _sub.frequency.setValueAtTime(sub_f, audioCtx.currentTime);
    }

    setOscillatorNode(_oscillator);
    setSubOscillatorNode(_sub);
  }

  const stopAmp = () => {
    if (!audioCtx || !oscillatorNode || !subOscillatorNode || !ampNode) { return }
    if (isStop) { return; }

    let t3 = audioCtx.currentTime;
    let t4 = release / 1000;
    ampNode.gain.cancelScheduledValues(t3);
    ampNode.gain.setValueAtTime(ampNode.gain.value, t3);
    ampNode.gain.setTargetAtTime(0, t3, t4);  // Release
    setIntervalID(window.setInterval(function() {
      let VALUE_OF_STOP = 1e-3;
      if (ampNode.gain.value < VALUE_OF_STOP) {
        oscillatorNode.stop(0);
        subOscillatorNode.stop(0);
        if (intervalID !== null) {
          window.clearInterval(intervalID);
          setIntervalID(null);
        }
        setIsStop(true);
      }
    }, 0))
  }

  return (
    <Card bg={theme.colors.brand[600]} color="white">
      <CardHeader>
        <ButtonOnce
          flag={!audioCtx}
          onClick={() => initAudio()}
        >
          Load Web Audio API (Click here!)
        </ButtonOnce>
        <Heading size='md'>Web Synthesizer (Beta)</Heading>
      </CardHeader>

      <CardBody pt={0}>
        {/* overflowX="scroll" overflowY="hidden" */}
        <Box overflowX="auto" overflowY="hidden">
          <HStack spacing="10px" align="start" height="300px">
            {/* Sub */}
            <Box bg={theme.colors.brand[700]} color="white" p={2} borderRadius="8px" minWidth="100px" height="100%">
              <SubOsc
                subOsc={subOsc}
                setSubOsc={setSubOsc}
                subOscGain={subOscGain}
                setSubOscGain={setSubOscGain}
                subOscType={subOscType}
                setSubOscType={setSubOscType}
                subOscOctave={subOscOctave}
                setSubOscOctave={setSubOscOctave}
                subOscTranspose={subOscTranspose}
                setSubOscTranspose={setSubOscTranspose}
              />
            </Box>

            {/* OSC */}
            <Box bg={theme.colors.brand[900]} color={theme.colors.brand[400]} borderRadius="8px" p={2} height="100%">
              <Heading size='xs'>
                OSC1{" "}
                <Tooltip label='オシレーター：波形を選ぼう'>
                  <QuestionIcon color={theme.colors.brand[700]} />
                </Tooltip>
              </Heading>
              <HStack height="100%" align="start" spacing={0}>
                <GainSlider gain={osc1Gain} setGain={setOsc1Gain} />
                <Box p={2}>
                  <WaveShapeMenu type={type} setType={setType} />
                  <WaveShapeCanvas type={type} />
                  <Divider />
                  <OscParams semi={osc1Semi} setSemi={setOsc1Semi} detune={osc1Detune} setDetune={setOsc1Detune} />
                </Box>
              </HStack>
            </Box>

            {/* Filter */}
            <Box bg={theme.colors.brand[800]} color="white" borderRadius="8px" height="100%" >
              <FilterMenu
                filter1={filter1}
                setFilter1={setFilter1}
                filter1Type={filter1Type}
                setFilter1Type={setFilter1Type}
                filter2={filter2}
                setFilter2={setFilter2}
                filter2Type={filter2Type}
                setFilter2Type={setFilter2Type}
              />
              <FilterCanvas
                audioCtx={audioCtx}
                filter1Node={filter1Node}
                filter1={filter1}
                filter1Type={filter1Type}
                filter1Freq={filter1Freq}
                filter1Q={filter1Q}
                filter1Gain={filter1Gain}
                filter2Node={filter2Node}
                filter2={filter2}
                filter2Type={filter2Type}
                filter2Freq={filter2Freq}
                filter2Q={filter2Q}
                filter2Gain={filter2Gain}
              />
              <FilterKnobsGroup
                filter1={filter1}
                filter1Type={filter1Type}
                filter1Freq={filter1Freq}
                setFilter1Freq={setFilter1Freq}
                filter1Q={filter1Q}
                setFilter1Q={setFilter1Q}
                filter1Gain={filter1Gain}
                setFilter1Gain={setFilter1Gain}
                filter2={filter2}
                filter2Type={filter2Type}
                filter2Freq={filter2Freq}
                setFilter2Freq={setFilter2Freq}
                filter2Q={filter2Q}
                setFilter2Q={setFilter2Q}
                filter2Gain={filter2Gain}
                setFilter2Gain={setFilter2Gain}
              />
            </Box>

            {/* Amp, Env */}
            <Box bg={theme.colors.brand[900]} color="white" p={1} borderRadius="8px" height="100%">
              <Tabs colorScheme="cyan" color={theme.colors.brand[700]} borderBottomColor={theme.colors.brand[700]}>
                <TabList>
                  <Tab _active={{background: "#0000"}}>
                    <Heading size='xs'>
                      AMP{" "}
                      <Tooltip label='アンプ：音の時間的な変化を設定できる'>
                        <QuestionIcon color={theme.colors.brand[700]} />
                      </Tooltip>
                    </Heading>
                  </Tab>
                  <Tab _active={{background: "#0000"}}>
                    <Heading size='xs'>
                      ENV1{" "}
                      <Tooltip label='エンベロープ：フィルターなどに使える'>
                        <QuestionIcon color={theme.colors.brand[700]} />
                      </Tooltip>
                    </Heading>
                  </Tab>
                  <Tab _active={{background: "#0000"}}>
                    <Heading size='xs'>
                      ENV2
                    </Heading>
                  </Tab>
                  <Tab _active={{background: "#0000"}}>
                    <Heading size='xs'>
                      LFO1
                    </Heading>
                  </Tab>
                  <Tab _active={{background: "#0000"}}>
                    <Heading size='xs'>
                      LFO2
                    </Heading>
                  </Tab>
                </TabList>
                <TabPanels color="white">
                  <TabPanel>
                    <Amp
                      attack={attack}
                      setAttack={setAttack}
                      decay={decay}
                      setDecay={setDecay}
                      sustain={sustain}
                      setSustain={setSustain}
                      release={release}
                      setRelease={setRelease}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Amp
                      attack={env1Attack}
                      setAttack={setEnv1Attack}
                      decay={env1Decay}
                      setDecay={setEnv1Decay}
                      sustain={env1Sustain}
                      setSustain={setEnv1Sustain}
                      release={env1Release}
                      setRelease={setEnv1Release}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Amp
                      attack={env2Attack}
                      setAttack={setEnv2Attack}
                      decay={env2Decay}
                      setDecay={setEnv2Decay}
                      sustain={env2Sustain}
                      setSustain={setEnv2Sustain}
                      release={env2Release}
                      setRelease={setEnv2Release}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Box minWidth="340px">
                      <Text pt='2' fontSize='sm'>
                        LFO1：フィルターなどに使える
                      </Text>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box minWidth="340px">
                      <Text pt='2' fontSize='sm'>
                        LFO2：フィルターなどに使える
                      </Text>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </HStack>
        </Box>

        <Keyboard startAmp={startAmp} stopAmp={stopAmp} />
      </CardBody>
    </Card>
  )
}

export default Synth
