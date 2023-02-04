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
import { noteNumberToFrequency } from '@/libs/utils'
import { BasicOscillatorType } from '@/providers/synth';

import { Knob } from '@/components/synth/knob';
import { ButtonOnce } from '@/components/synth/ButtonOnce';
import { GainSlider } from '@/components/synth/osc/gainSlider';
import { WaveShapeCanvas } from '@/components/synth/osc/waveShapeCanvas';
import { WaveShapeMenu } from '@/components/synth/osc/waveShapeMenu';
import { OscParams } from '@/components/synth/osc/oscParams';
import { Amp } from '@/components/synth/amp/';
import { FilterCanvas } from '@/components/synth/filter/filterCanvas';
import { FrequencySlider } from '@/components/synth/filter/frequencySlider';
import { Keyboard } from '@/components/synth/keyboard';
import { SubOsc } from '@/components/synth/subOsc';


// Amp 実装参考
// https://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/envelope-generator

/*
oscillator
- gain
- osc type
- attack 0.0 ms ~ 20.0 s
- decay 1.5 ms ~ 20.0 s
- sustain 0.0 dB ~ -Inf dB
- release 1.5 ms ~ 20.0 s
- lPF
- HPF
- Filter freq 20 Hz ~ 20.5 kHz


TODO:
- canvas (ADSR) の実装変更 ... eventListener を React Styleに
- canvas (ADSR) の実装変更 ... リファクタリング
- Filer 実装
- Env 実装 (ADSR) をコピー
- Sub Osc 実装
- Osc2 実装

*/


const Synth = () => {
  // web audio api
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillatorNode, setOscillatorNode] = useState<OscillatorNode | null>(null);
  const [ampNode, setAmpNode] = useState<GainNode | null>(null);
  const [oscillatorGainNode, setOscillatorGainNode] = useState<GainNode | null>(null);
  const [filterNode, setFilterNode] = useState<BiquadFilterNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [analyzeData, setAnalyzeData] = useState<Uint8Array>(new Uint8Array(1024));
  const [intervalID, setIntervalID] = useState<any>(null);
  const [isStop, setIsStop] = useState<Boolean>(true);

  // params
  const [type, setType] = useState<BasicOscillatorType>("sine");
  const [osc1Gain, setOsc1Gain] = useState<number>(100); // TODO: とりあえず 0 ~ 100 %
  const [osc1Semi, setOsc1Semi] = useState<number>(0);
  const [osc1Detune, setOsc1Detune] = useState<number>(0);
  const [subOsc, setSubOsc] = useState<boolean>(false);
  const [subOscGain, setSubOscGain] = useState<number>(50);
  const [subOscOctave, setSubOscOctave] = useState<number>(-1);
  const [subOscTranspose, setSubOscTranspose] = useState<number>(0); // -48 ~ 48 (st)
  const [subOscType, setSubOscType] = useState<"sync" | BasicOscillatorType>("sync");
  const [filterFreq, setFilterFreq] = useState<number>(20500); // 0 ~ 20.5k
  const [filterQ, setFilterQ] = useState<number>(5); // 0 ~ 50

  const [attack, setAttack] = useState(10);   // attack (ms)
  const [decay, setDecay] = useState(300);     // decay (ms)
  const [sustain, setSustain] = useState(70); // sustain (%)
  const [release, setRelease] = useState(100); // release (ms)

  const [env1attack, setEnv1Attack] = useState(100);   // attack (ms)
  const [env1decay, setEnv1Decay] = useState(300);     // decay (ms)
  const [env1sustain, setEnv1Sustain] = useState(70); // sustain (%)
  const [env1release, setEnv1Release] = useState(300); // release (ms)

  const [env2attack, setEnv2Attack] = useState(100);   // attack (ms)
  const [env2decay, setEnv2Decay] = useState(300);     // decay (ms)
  const [env2sustain, setEnv2Sustain] = useState(70); // sustain (%)
  const [env2release, setEnv2Release] = useState(300); // release (ms)

  const initAudio = () => {
    console.log("start init osc");
    const _audioCtx = new AudioContext();

    setAudioCtx(_audioCtx);
    setOscillatorNode(new OscillatorNode(_audioCtx));
    setOscillatorGainNode(new GainNode(_audioCtx));
    setAmpNode(new GainNode(_audioCtx));
    setFilterNode(new BiquadFilterNode(_audioCtx));
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

    console.log("done init osc");
  }

  // noteNumber: e.g. C4 = 60
  const startAmp = (noteNumber: number) => {
    if (!audioCtx) { initAudio(); }
    if (!audioCtx || !oscillatorNode || !oscillatorGainNode || !ampNode || !filterNode || !analyserNode) {
      console.log("error: Can't use Audio Context!")
      return;
    }
    if (!isStop) { oscillatorNode.stop(0); }

    const _oscillator = new OscillatorNode(audioCtx);

    filterNode.type = "lowpass";
    filterNode.frequency.value = filterFreq;
    filterNode.Q.value = filterQ;
    _oscillator.type = type;
    _oscillator.detune.value = osc1Detune;
    oscillatorGainNode.gain.value = osc1Gain / 100;

    // TODO: insert compressor
    _oscillator.connect(oscillatorGainNode)
               .connect(ampNode)
               .connect(filterNode)
               .connect(analyserNode)
               .connect(audioCtx.destination);

    let t0 = audioCtx.currentTime;
    _oscillator.start(t0);
    ampNode.gain.setValueAtTime(0, t0);
    let t1      = t0 + attack / 1000;  // (at start) + (attack time)
    let t2      = decay / 1000;
    let t2Value = sustain / 100;

    ampNode.gain.linearRampToValueAtTime(1, t1);
    ampNode.gain.setTargetAtTime(t2Value, t1, t2);
    setIsStop(false);

    const f = noteNumberToFrequency(noteNumber + osc1Semi)
    _oscillator.frequency.setValueAtTime(f, audioCtx.currentTime);
    setOscillatorNode(_oscillator);
  }

  const stopAmp = () => {
    if (!audioCtx || !oscillatorNode || !ampNode) { return }
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
        if (intervalID !== null) {
          window.clearInterval(intervalID);
          setIntervalID(null);
        }
        setIsStop(true);
      }
    }, 0))
  }

  return (
    <Card bg={theme.colors.brand[600]} color="white" minWidth="min-content">
      <CardHeader>
        <ButtonOnce
          flag={!(audioCtx && oscillatorNode && ampNode)}
          onClick={() => initAudio()}
        >
          Load Web Audio API (Click here!)
        </ButtonOnce>
        <Heading size='md'>Web Synthesizer (Beta)</Heading>
      </CardHeader>

      <CardBody pt={0}>
        {/* overflowX="scroll" overflowY="hidden" */}
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
            <Heading size='xs' p={2} pb={1}>
                Filter{" "}
                <Tooltip label='フィルター：ローカット・ハイカットができる'>
                  <QuestionIcon color={theme.colors.brand[700]} />
                </Tooltip>
              </Heading>

              <FilterCanvas audioCtx={audioCtx} analyzeData={analyzeData} filterFreq={filterFreq} filterQ={filterQ} />
              <FrequencySlider filterFreq={filterFreq} setFilterFreq={setFilterFreq} filterQ={filterQ} setFilterQ={setFilterQ} />
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
                    attack={env1attack}
                    setAttack={setEnv1Attack}
                    decay={env1decay}
                    setDecay={setEnv1Decay}
                    sustain={env1sustain}
                    setSustain={setEnv1Sustain}
                    release={env1release}
                    setRelease={setEnv1Release}
                  />
                </TabPanel>
                <TabPanel>
                  <Amp
                    attack={env2attack}
                    setAttack={setEnv2Attack}
                    decay={env2decay}
                    setDecay={setEnv2Decay}
                    sustain={env2sustain}
                    setSustain={setEnv2Sustain}
                    release={env2release}
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

        <Keyboard startAmp={startAmp} stopAmp={stopAmp} />
      </CardBody>
    </Card>
  )
}

export default Synth
