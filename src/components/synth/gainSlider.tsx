import {
  Text,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  HStack,
} from '@chakra-ui/react'
import { useState } from 'react';

/*

TODO:
- 実際にオシレーターのGain を変更する
- 見た目の改善 (ホバーで現在の値を表示する)
*/

const GainSlider = () => {
  const [gain, setGain] = useState<number>(0);
  const handleChange = (value: number) => setGain(value)
  const MAX = 6;
  const MIN = -100;

  return (
    <Box backgroundColor="gray.200" textAlign="center" p={2} height="100%" borderRadius="8px">
      <Text w="80px" m="0">Gain</Text>
      <Box height="80%" py={4}>
        <Slider
          aria-label='gain-slider'
          focusThumbOnChange={false}
          orientation='vertical'
          max={MAX}
          min={MIN}
          value={gain}
          onChange={(value) => handleChange(value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      <HStack>
        <NumberInput
          size="xs"
          borderColor="gray.300"
          max={MAX}
          min={MIN}
          value={gain}
          onChange={(value) => handleChange(Number(value))}
        >
          <NumberInputField p={1} w={10} textAlign="center" _hover={{borderColor: "gray.400"}}/>
        </NumberInput>
        <Text>{' '}dB</Text>
      </HStack>
    </Box>
  )
}

export default GainSlider
