import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  StackDivider,
  Text,
  HStack,
  VStack,
  Stack,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Select,
  Button,
} from '@chakra-ui/react'
import GainSlider from './gainSlider';
import { isBasicOscillatorType, SynthProvider } from '@/providers/synth';
import ButtonOnce from './ButtonOnce';


/*
oscillator
- gain
- osc type
- attack
- decay
- sustain
- release

*/


const Synth = () => {
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null)
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null)
  const [gain, setGain] = useState<GainNode | null>(null)

  const initAudio = () => {
    console.log("start init osc");
    const _audioCtx = new AudioContext();
    const _oscillator = new OscillatorNode(_audioCtx);
    const _gain = new GainNode(_audioCtx)
    _gain.gain.value = 0;
    _oscillator.connect(_gain);
    _gain.connect(_audioCtx.destination);
    _oscillator.start();

    let bpm = 120;
    let note_length = 60 / bpm;
    for (let n = 0; n < 16; n++) {
      // 音の開始・終了時間を計算する
      let start_time = n * note_length;
      let end_time = start_time + 0.1;
      // gain (音量)を時間指定で設定することで鳴らしたり止めたりする
      _gain.gain.setValueAtTime(0.4, _audioCtx.currentTime + start_time);
      _gain.gain.setValueAtTime(0.0, _audioCtx.currentTime + end_time);
      // 小節の最初の音だけ高くする
      if (n % 4 == 0) {
        _oscillator.frequency.setValueAtTime(880, _audioCtx.currentTime + start_time);
      } else {
        _oscillator.frequency.setValueAtTime(440, _audioCtx.currentTime + start_time);
      }
    }

    setAudioCtx(_audioCtx);
    setOscillator(_oscillator);
    setGain(_gain);
    console.log("done init osc");
  }

  const countBeat = () => {
    if (!audioCtx || !oscillator || !gain) { return }

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
  }

  return (
    <Card maxW='md' backgroundColor='gray.100'>
      <CardHeader>
        <ButtonOnce
          flag={!(audioCtx && oscillator && gain)}
          onClick={() => initAudio()}
        >
          Load Web Audio API
        </ButtonOnce>
        <Heading size='md'>Analog Synthesizer</Heading>
      </CardHeader>

      {audioCtx && oscillator && gain ?
      <CardBody>
        <HStack spacing="24px">
          <GainSlider />
          <Stack divider={<StackDivider />} spacing='4'>
            <Box>
              <Button 
                colorScheme='teal'
                size='sm'
                onClick={() => {
                  console.log("play");
                  countBeat();
                }}
              >test</Button>
              <Heading size='xs' textTransform='uppercase'>
                Osc1
              </Heading>
              <Text pt='2' fontSize='sm'>
                オシレーター：波形を選ぼう
              </Text>
              <Select
                defaultValue='sine'
                placeholder='Osc Type'
                onChange={(e) => {
                  const input = e.target.value;
                  if (isBasicOscillatorType(input)) {
                    oscillator.type = input;
                  }
                }}>
                <option value='sine'>Sine</option>
                <option value='square'>Square</option>
                <option value='sawtooth'>Sawtooth</option>
                <option value='triangle'>Triangle</option>
              </Select>
            </Box>

            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Amp
              </Heading>
              <Text pt='2' fontSize='sm'>
                アンプ：アタック・ディケイ・サスティン・リリースを設定しよう
              </Text>
            </Box>
            <Box>
              <Heading size='xs' textTransform='uppercase'>
                Env1
              </Heading>
              <Text pt='2' fontSize='sm'>
                エンベロープ：フィルターなどに使える
              </Text>
            </Box>
          </Stack>
        </HStack>
      </CardBody>
      : <></>}
    </Card>
  )
}

export default Synth
