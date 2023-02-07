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
  Divider,
  Flex
} from '@chakra-ui/react'
import { useState } from 'react';
import { Knob } from '@/components/synth/knob';
import { clamp } from '@/libs/utils';
import { FilterKnobs } from './filterKnobs';

interface Props {
  filter1: boolean;
  filter1Type: BiquadFilterType;
  filter1Freq: number;
  setFilter1Freq: (freq: number) => void;
  filter1Q: number;
  setFilter1Q: (q: number) => void;
  filter1Gain: number;
  setFilter1Gain: (q: number) => void;
  filter2: boolean;
  filter2Type: BiquadFilterType;
  filter2Freq: number;
  setFilter2Freq: (freq: number) => void;
  filter2Q: number;
  setFilter2Q: (q: number) => void;
  filter2Gain: number;
  setFilter2Gain: (q: number) => void;
}

export const FilterKnobsGroup = ({
  filter1,
  filter1Type,
  filter1Freq,
  setFilter1Freq,
  filter1Q,
  setFilter1Q,
  filter1Gain,
  setFilter1Gain,
  filter2,
  filter2Type,
  filter2Freq,
  setFilter2Freq,
  filter2Q,
  setFilter2Q,
  filter2Gain,
  setFilter2Gain,
}: Props) => {

  return (
    <Box py={2} height="calc(100% - 100px - 30px)" fontSize="14px">
      <Flex height="100%" alignSelf="stretch">
        <Box flex={1} px={2} textAlign="center" justifyContent="center">
          <FilterKnobs
            filter={filter1}
            filterType={filter1Type}
            filterFreq={filter1Freq}
            setFilterFreq={setFilter1Freq}
            filterQ={filter1Q}
            setFilterQ={setFilter1Q}
            filterGain={filter1Gain}
            setFilterGain={setFilter1Gain}
          />
        </Box>

        <Divider color="white" orientation="vertical" />

        <Box flex={1} px={2} textAlign="center" justifyContent="center">
        <FilterKnobs
            filter={filter2}
            filterType={filter2Type}
            filterFreq={filter2Freq}
            setFilterFreq={setFilter2Freq}
            filterQ={filter2Q}
            setFilterQ={setFilter2Q}
            filterGain={filter2Gain}
            setFilterGain={setFilter2Gain}
          />
        </Box>
      </Flex>
    </Box>
  )
}
