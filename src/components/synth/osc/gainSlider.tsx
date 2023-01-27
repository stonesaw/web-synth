import { theme } from '@/libs/theme';
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

TODO: 実際にオシレーターのGain を変更する
*/

export const GainSlider = () => {
  const [gain, setGain] = useState<number>(0);
  const handleChange = (value: number) => setGain(value)
  const MAX = 6;
  const MIN = -40;

  return (
    <Box py={2} px={1} textAlign="center" height="100%">
      <Text w="80px" m="0">Gain</Text>
      <Box height="70%" py={4}>
        <Slider
          aria-label='gain-slider'
          focusThumbOnChange={false}
          orientation='vertical'
          max={MAX}
          min={MIN}
          value={gain}
          onChange={(value) => handleChange(value)}
        >
          <SliderTrack bg="gray.600">
            <SliderFilledTrack bg={theme.colors.brand[400]} />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      <HStack>
        <NumberInput
          size="xs"
          borderColor="gray.300"
          variant="flushed"
          max={MAX}
          min={MIN}
          value={gain}
          onChange={(value) => handleChange(Number(value))}
        >
          <NumberInputField p={1} w={10} textAlign="center"/>
        </NumberInput>
        <Text>dB</Text>
      </HStack>
    </Box>
  )
}

export default GainSlider
