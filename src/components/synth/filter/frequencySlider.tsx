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
  Divider
} from '@chakra-ui/react'
import { useState } from 'react';

interface Props {
  filterFreq: number,
  setFilterFreq: (freq: number) => void,
  filterQ: number,
  setFilterQ: (q: number) => void,
}

export const FrequencySlider = ({
  filterFreq,
  setFilterFreq,
  filterQ,
  setFilterQ,
}: Props) => {
  const handleFreqChange = (value: number) => setFilterFreq(value)
  const handleQChange = (value: number) => setFilterQ(value)
  const MAX = 12000;
  const MIN = 0;

  return (
    <Box p={2}>
      <HStack>
        <Text w="80px" m="0">Freq.</Text>
        <NumberInput
          size="xs"
          borderColor="gray.300"
          variant="flushed"
          max={MAX}
          min={MIN}
          value={filterFreq}
          onChange={(value) => handleFreqChange(Number(value))}
        >
          <NumberInputField p={1} w={10} textAlign="center"/>
        </NumberInput>
        <Text>Hz</Text>
      </HStack>
      <Box height="70%" py={4}>
        <Slider
          aria-label='frequency-slider'
          focusThumbOnChange={false}
          max={MAX}
          min={MIN}
          value={filterFreq}
          onChange={(value) => handleFreqChange(value)}
        >
          <SliderTrack bg={theme.colors.brand[600]}>
            <SliderFilledTrack bg={theme.colors.brand[500]} />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      <Divider />

      <HStack>
        <Text w="80px" m="0">Q.</Text>
        <NumberInput
          size="xs"
          borderColor="gray.300"
          variant="flushed"
          max={50}
          min={0}
          value={filterQ}
          onChange={(value) => handleQChange(Number(value))}
        >
          <NumberInputField p={1} w={10} textAlign="center"/>
        </NumberInput>
        <Text></Text>
      </HStack>
      <Box py={4}>
        <Slider
          aria-label='frequency-slider'
          focusThumbOnChange={false}
          max={50}
          min={0}
          value={filterQ}
          onChange={(value) => handleQChange(value)}
        >
          <SliderTrack bg={theme.colors.brand[600]}>
            <SliderFilledTrack bg={theme.colors.brand[500]} />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </Box>
  )
}
