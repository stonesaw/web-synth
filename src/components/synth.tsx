import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Text, Stack, Box } from '@chakra-ui/react'

const Synth: NextPage = () => {
  useEffect(() => {
    const audioContext = new AudioContext();
    const oscillator = new OscillatorNode(audioContext);
    oscillator.frequency.value = 400;
    const gain = new GainNode(audioContext);

    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();

    // テンポに従って音の鳴り始める(音量が0.3になる)時間と鳴り終わる(音量が0になる)時間を設定する
    let bpm = 120
    let note_length = 60 / bpm
    // 120回分のメトロノームの音を設定する
    for (let n = 0; n < 16; n++) {
        // 音の開始・終了時間を計算する
        let start_time = n * note_length;
        let end_time = start_time + 0.05
        // gain (音量)を時間指定で設定することで鳴らしたり止めたりする
        gain.gain.setValueAtTime(0.3, audioContext.currentTime + start_time)
        gain.gain.setValueAtTime(0.0, audioContext.currentTime + end_time)
        // 小節の最初の音だけ高くする
        if (n % 4 == 0) {
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime + start_time)
        } else {
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime + start_time)
        }
    }
  }, []);

  return (
    <Card maxW='md' backgroundColor='gray.100'>
      <CardHeader>
        <Heading size='md'>Analog Synthesizer</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing='4'>
          <Box>
            <Heading size='xs' textTransform='uppercase'>
              Osc1
            </Heading>
            <Text pt='2' fontSize='sm'>
              オシレーター：波形を選ぼう
            </Text>
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
      </CardBody>
    </Card>
  )
}

export default Synth
