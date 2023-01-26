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
  NumberInput,
  NumberInputField,
  Flex,
  Spacer,
  Divider,
  theme
} from '@chakra-ui/react'
import GainSlider from './gainSlider';
import ButtonOnce from './ButtonOnce';
import { QuestionIcon } from '@chakra-ui/icons';
// import Amp from './amp';


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

*/

type BasicOscillatorType = "sawtooth" | "sine" | "square" | "triangle";

const isBasicOscillatorType = (type: string): type is BasicOscillatorType => {
  return (
    type === "sine" ||
    type === "square" ||
    type === "sawtooth" ||
    type === "triangle"
  )
}


const Synth = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gain, setGain] = useState<GainNode | null>(null);
  const [isStop, setIsStop] = useState<Boolean>(true);
  const [type, setType] = useState<BasicOscillatorType>("sine");
  const [attack, setAttack] = useState(50);   // attack (ms)
  const [decay, setDecay] = useState(300);     // decay (ms)
  const [sustain, setSustain] = useState(60); // sustain (%)
  const [release, setRelease] = useState(1000); // release (ms)
  const [intervalID, setIntervalID] = useState<any>(null);

  // canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        const px = 10;
        const py = 12;
        const containerW = canvas.width  - px * 2;
        const containerY = canvas.height - py * 2;
        const buttonR = 7;

        let mx = 0;
        let my = 0;

        console.log("set ADSR");
        let a = 0.3; // 0.0 ~ 1.0
        let d = 0.7; // 0.0 ~ 1.0
        let s = 0.8; // 0.0 ~ 1.0
        let r = 0.5; // 0.0 ~ 1.0

        let t0x = px;
        let t0y = py + containerY;
        let t1x = px + containerW * (a / 4.0);
        let t1y = py;
        let t2x = px + containerW * (0.25 + d / 4.0);
        let t2y = py + containerY * (1 - s);
        let t3x = px + containerW * 0.75;
        let t3y = t2y;
        let t4x = px + containerW * (0.75 + r / 4.0);
        let t4y = py + containerY;

        let moveFlag = "";

        window.addEventListener('mousedown', () => {
          // マウスホバーしているか
          if (Math.sqrt((t1x - mx) ** 2 + (t1y - my) ** 2) <= buttonR) {
            moveFlag = "a";
          } else if (Math.sqrt((t2x - mx) ** 2 + (t2y - my) ** 2) <= buttonR) {
            moveFlag = "d";
          } else if (Math.sqrt((t4x - mx) ** 2 + (t4y - my) ** 2) <= buttonR) {
            moveFlag = "r";
          }
        }, false);

        window.addEventListener('mouseup', () => {
          moveFlag = ""
        }, false);

        canvas.addEventListener('mousemove', (evt) => {
          const rect = canvas.getBoundingClientRect();
          mx = evt.clientX - rect.left;
          my = evt.clientY - rect.top;

          if (moveFlag != "") {
            canvas.style.cursor = "pointer";
          } else {
            // hover
            if (Math.sqrt((t1x - mx) ** 2 + (t1y - my) ** 2) <= buttonR ||
                Math.sqrt((t2x - mx) ** 2 + (t2y - my) ** 2) <= buttonR ||
                Math.sqrt((t4x - mx) ** 2 + (t4y - my) ** 2) <= buttonR) {
              canvas.style.cursor = "pointer";
            } else {
              canvas.style.cursor = "auto";
            }
          }

          if (moveFlag != "") {
            if (moveFlag == "a") {
              t1x = Math.max(px, Math.min(mx, px + containerW * 0.25));
            } else if (moveFlag == "d") {
              t2x = Math.max(px + containerW * 0.25, Math.min(mx, px + containerW * 0.5));
              t2y = Math.max(py, Math.min(my, py + containerY));
              t3y = Math.max(py, Math.min(my, py + containerY));
            } else if (moveFlag == "r") {
              t4x = Math.max(px + containerW * 0.75, Math.min(mx, px + containerW));
            }
          }

          // bg
          context.fillStyle = theme.colors.gray[300];
          context.fillRect(0,0, canvas.width, canvas.height);
          [
            theme.colors.red[200],
            theme.colors.orange[200],
            theme.colors.green[200],
            theme.colors.blue[200]
          ].map((c, i) => {
            context.fillStyle = c;
            context.fillRect(px + containerW * 0.25 * i, py, containerW / 4, containerY);
          })

          // line
          context.lineWidth = 3;
          context.strokeStyle = theme.colors.gray[100];

          context.beginPath();
          context.moveTo(t0x, t0y);
          context.lineTo(t1x, t1y);
          context.stroke();

          context.beginPath();
          context.moveTo(t1x, t1y);
          context.lineTo(t2x, t2y);
          context.stroke();

          context.beginPath();
          context.moveTo(t2x, t2y);
          context.lineTo(t3x, t3y);
          context.stroke();

          context.beginPath();
          context.moveTo(t3x, t3y);
          context.lineTo(t4x, t4y);
          context.stroke();

          // button
          // attack
          context.beginPath();
          context.arc(t1x, t1y, buttonR, 0, Math.PI * 2, true);
          context.fillStyle = "white";
          context.fill();

          // decay
          context.beginPath();
          context.arc(t2x, t2y, buttonR, 0, Math.PI * 2, true);
          context.fillStyle = "white";
          context.fill();

          // release
          context.beginPath();
          context.arc(t4x, t4y, buttonR, 0, Math.PI * 2, true);
          context.fillStyle = "white";
          context.fill();

        }, false);
      }
    }
  })


  const initAudio = () => {
    console.log("start init osc");
    const _audioCtx = new AudioContext();
    const _oscillator = new OscillatorNode(_audioCtx);
    const _gain = new GainNode(_audioCtx)
    // _gain.gain.value = 0;
    // _oscillator.connect(_gain);
    // _gain.connect(_audioCtx.destination);
    // _oscillator.start();

    setAudioCtx(_audioCtx);
    setOscillator(_oscillator);
    setGain(_gain);
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

  // const formatSec = (value: number | string) => {
  //   return (Number(value) >= 1000 ? value + "s" : value + "ms");
  // }

  // const parseSec = (value: string) => {
  //   const m = value.match(/(\d*)(ms|s)/i);
  //   if (m) {
  //     const num = m[1] == "" ? 0 : Number(m[1]);
  //     const uni = m[2] == "s" ? 1000 : 1
  //     return num * uni;
  //   }
  //   return 0;
  // }

  return (
    <Card backgroundColor='gray.100'>
      <CardHeader>
        <ButtonOnce
          flag={!(audioCtx && oscillator && gain)}
          onClick={() => initAudio()}
        >
          Load Web Audio API
        </ButtonOnce>
        <Heading size='md'>Web Synthesizer</Heading>
      </CardHeader>

      {audioCtx && oscillator && gain ?
      <CardBody>
        <HStack spacing="10px" align="start" height="300px" >
          <GainSlider />
            <Box backgroundColor="gray.200"  p={2} borderRadius="8px" height="100%">
              <Heading size='xs' textTransform='uppercase'>
                OSC1{" "}
                <Tooltip label='オシレーター：波形を選ぼう'>
                  <QuestionIcon color="gray.600" />
                </Tooltip>
              </Heading>
              <Select
                defaultValue='sine'
                onChange={(e) => {
                  const input = e.target.value;
                  if (oscillator && isBasicOscillatorType(input)) {
                    oscillator.type = input;
                    setType(input);
                  }
                }}>
                <option value='sine'>Sine</option>
                <option value='square'>Square</option>
                <option value='sawtooth'>Sawtooth</option>
                <option value='triangle'>Triangle</option>
              </Select>
            </Box>

            {/* Amp, Env */}
            <Box backgroundColor="gray.200"  p={2} borderRadius="8px" height="100%">
              <Tabs variant='enclosed'>
                <TabList>
                  {
                    ["AMP", "ENV1", "ENV2"].map(((tab, index) => {
                      return (
                        <Tab key={tab}>
                          <Heading size='xs'>
                            {tab}{" "}
                            {
                              index == 0 ? (
                              <Tooltip label='アンプ：アタック・ディケイ・サスティン・リリースを設定しよう'>
                                <QuestionIcon color="gray.600" />
                              </Tooltip>
                              ) : <></>
                            }
                          </Heading>
                        </Tab>
                      )
                    }))
                  }
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {/* Amp */}
                    <Box>
                      {/* <Box backgroundColor={"gray.300"} width="300px" height="100%">
                        TODO: 山みたいなのを表示。ここでも値の調節が可能
                      </Box> */}
                      <canvas width="340px" height="160px" ref={canvasRef} />

                      <Box pt={2} className='amp-meter'>
                        <Flex>
                          <Box>
                            <VStack align="start">
                              <Text size="xs">A</Text>
                              <HStack>
                                <NumberInput
                                  size="xs"
                                  borderColor="gray.300"
                                  min={5}
                                  max={20000}
                                  defaultValue={attack}
                                  onChange={(value) => {setAttack(Number(value))}}
                                >
                                  <NumberInputField p={1} w={12} textAlign="center" _hover={{borderColor: "gray.400"}}/>
                                </NumberInput>
                                <Text>ms</Text>
                              </HStack>
                            </VStack>
                          </Box>
                          <Spacer />
                          <Box>
                            <VStack align="start">
                              <Text size="xs">D</Text>
                              <HStack>
                                <NumberInput
                                  size="xs"
                                  borderColor="gray.300"
                                  min={5}
                                  max={20000}
                                  defaultValue={decay}
                                  onChange={(value) => {setDecay(Number(value))}}
                                >
                                  <NumberInputField p={1} w={12} textAlign="center" _hover={{borderColor: "gray.400"}}/>
                                </NumberInput>
                                <Text>ms</Text>
                              </HStack>
                            </VStack>
                          </Box>
                          <Spacer />
                          <Box>
                            <VStack align="start">
                              <Text size="xs">S</Text>
                              <HStack>
                                <NumberInput
                                  size="xs"
                                  borderColor="gray.300"
                                  min={0}
                                  max={100}
                                  defaultValue={sustain}
                                  onChange={(value) => {setSustain(Number(value))}}
                                >
                                  <NumberInputField p={1} w={12} textAlign="center" _hover={{borderColor: "gray.400"}}/>
                                </NumberInput>
                                <Text>%</Text>
                              </HStack>
                            </VStack>
                          </Box>
                          <Spacer />
                          <Box>
                            <VStack align="start">
                              <Text size="xs">R</Text>
                              <HStack>
                                <NumberInput
                                  size="xs"
                                  borderColor="gray.300"
                                  min={1}
                                  max={20000}
                                  // format={formatSec}
                                  // parse={parseSec}
                                  value={release}
                                  onChange={(value) => setRelease(Number(value))}
                                >
                                  <NumberInputField p={1} w={12} textAlign="center" _hover={{borderColor: "gray.400"}}/>
                                </NumberInput>
                                <Text>ms</Text>
                              </HStack>
                            </VStack>
                          </Box>
                          <Spacer />
                        </Flex>
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box height={32}>
                      <Text pt='2' fontSize='sm'>
                        エンベロープ：フィルターなどに使える
                      </Text>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box height={32}>
                      <Text pt='2' fontSize='sm'>
                        エンベロープ2：フィルターなどに使える
                      </Text>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          {/* </Stack> */}
        </HStack>

        <Button
          colorScheme='teal'
          size='sm'
          onMouseDown={() => {
            console.log("AMP start");
            startAmp();
          }}
          onMouseUp={() => {
            console.log("AMP stop");
            stopAmp();
          }}
        >test</Button>
      </CardBody>
      : <></>}
    </Card>
  )
}

export default Synth
