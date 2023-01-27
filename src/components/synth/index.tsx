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
  Select,
  Button,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tooltip,
} from '@chakra-ui/react'
import { QuestionIcon } from '@chakra-ui/icons';

import { theme } from '@/libs/theme'
import { BasicOscillatorType, isBasicOscillatorType } from '@/providers/synth';
import { ButtonOnce } from '@/components/synth/ButtonOnce';
import { GainSlider } from '@/components/synth/osc/gainSlider';
import { WaveShaperCanvas } from '@/components/synth/osc/waveShapeCanvas';
import { Amp } from '@/components/synth/amp/';


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
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gain, setGain] = useState<GainNode | null>(null);
  const [isStop, setIsStop] = useState<Boolean>(true);
  const [type, setType] = useState<BasicOscillatorType>("sine");
  const [intervalID, setIntervalID] = useState<any>(null);

  const [attack, setAttack] = useState(100);   // attack (ms)
  const [decay, setDecay] = useState(300);     // decay (ms)
  const [sustain, setSustain] = useState(70); // sustain (%)
  const [release, setRelease] = useState(300); // release (ms)

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
    setOscillator(new OscillatorNode(_audioCtx));
    setGain(new GainNode(_audioCtx));
    console.log("done init osc");
  }

  const startAmp = () => {
    if (!audioCtx || !oscillator || !gain) { return }
    if (!isStop) { oscillator.stop(0); }

    const _oscillator = new OscillatorNode(audioCtx);
    _oscillator.type = type;
    _oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    let t0 = audioCtx.currentTime;
    _oscillator.start(t0);
    gain.gain.setValueAtTime(0, t0);
    let t1      = t0 + attack / 1000;  // (at start) + (attack time)
    let t2      = decay / 1000;
    let t2Value = sustain / 100;

    gain.gain.linearRampToValueAtTime(1, t1);
    gain.gain.setTargetAtTime(t2Value, t1, t2);
    setIsStop(false);

    _oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    setOscillator(_oscillator);
  }

  const stopAmp = () => {
    if (!audioCtx || !oscillator || !gain) { return }
    if (isStop) { return; }

    let t3 = audioCtx.currentTime;
    let t4 = release / 1000;
    gain.gain.cancelScheduledValues(t3);
    gain.gain.setValueAtTime(gain.gain.value, t3);
    gain.gain.setTargetAtTime(0, t3, t4);  // Release
    setIntervalID(window.setInterval(function() {
      let VALUE_OF_STOP = 1e-3;
      if (gain.gain.value < VALUE_OF_STOP) {
        oscillator.stop(0);
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
          flag={!(audioCtx && oscillator && gain)}
          onClick={() => initAudio()}
        >
          Load Web Audio API (Click here!)
        </ButtonOnce>
        <Heading size='md'>Web Synthesizer (Beta)</Heading>
      </CardHeader>

      {audioCtx && oscillator && gain ?
      <CardBody pt={0}>
        {/* overflowX="scroll" overflowY="hidden" */}
        <HStack spacing="10px" align="start" height="300px">
          {/* Sub */}
          <Box bg={theme.colors.brand[700]} color="white" p={2} borderRadius="8px" minWidth="100px" height="100%">
            <Heading size='xs'>
                Sub{" "}
                <Tooltip label='フィルター：ローカット・ハイカットができる'>
                  <QuestionIcon color={theme.colors.gray[300]} />
                </Tooltip>
              </Heading>
          </Box>

          {/* OSC */}
          <Box bg={theme.colors.brand[900]} color={theme.colors.brand[400]} borderRadius="8px" p={2} height="100%">
            <Heading size='xs'>
              OSC1{" "}
              <Tooltip label='オシレーター：波形を選ぼう'>
                <QuestionIcon color={theme.colors.brand[700]} />
              </Tooltip>
            </Heading>
            <HStack height="100%" align="start">
              <GainSlider />
              <Box p={2}>
                <Select
                  defaultValue='sine'
                  variant="flushed"
                  onChange={(e) => {
                    const input = e.target.value;
                    if (isBasicOscillatorType(input)) { setType(input); }
                  }}>
                  <option style={{"background": theme.colors.brand[900]}} value='sine'>Sine</option>
                  <option style={{"background": theme.colors.brand[900]}} value='square'>Square</option>
                  <option style={{"background": theme.colors.brand[900]}} value='sawtooth'>Sawtooth</option>
                  <option style={{"background": theme.colors.brand[900]}} value='triangle'>Triangle</option>
                </Select>
                <WaveShaperCanvas type={type} />
              </Box>
            </HStack>
          </Box>

          {/* Filter */}
          <Box bg={theme.colors.brand[900]} color="white" p={2} borderRadius="8px" minWidth="200px" height="100%" >
            <Heading size='xs'>
                Filter{" "}
                <Tooltip label='フィルター：ローカット・ハイカットができる'>
                  <QuestionIcon color={theme.colors.brand[700]} />
                </Tooltip>
              </Heading>
          </Box>

          {/* Amp, Env */}
          <Box bg={theme.colors.brand[900]} color="white" p={2} borderRadius="8px" height="100%">
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

        <Button
          colorScheme='teal'
          size='xs'
          onMouseDown={() => {
            console.log("AMP start");
            startAmp();
          }}
          onMouseUp={() => {
            console.log("AMP stop");
            stopAmp();
          }}
        >play 440Hz (test)</Button>
      </CardBody>
      : <></>}
    </Card>
  )
}

export default Synth
