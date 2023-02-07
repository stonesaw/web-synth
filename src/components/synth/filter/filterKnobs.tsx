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
import { FrequencyKnob } from '@/components/synth/frequencyKnob';
import { clamp } from '@/libs/utils';
import { getQRange, getGainRange, filterQGainUsedFlags } from '@/providers/synth';

interface Props {
  filter: boolean,
  filterType: BiquadFilterType
  filterFreq: number,
  setFilterFreq: (freq: number) => void,
  filterQ: number,
  setFilterQ: (q: number) => void,
  filterGain: number,
  setFilterGain: (q: number) => void,
}

export const FilterKnobs = ({
  filter,
  filterType,
  filterFreq,
  setFilterFreq,
  filterQ,
  setFilterQ,
  filterGain,
  setFilterGain
}: Props) => {
  const FREQ_MAX = 20500;
  const FREQ_MIN = 10;

  const displayFreq = (freq: number) => {
    if (freq < 1000) {
      return String(freq) + "Hz";
    } else {
      return String(freq / 1000) + "kHz";
    }
  }

  return (
    <>
      <Text pb={1}>Frequency</Text>
      <Box ml={4} width="min-content" position="relative">
        <FrequencyKnob
          value={filterFreq}
          // https://webaudioapi.com/samples/frequency-response/
          onChange={(v) => setFilterFreq(v)}
          min={FREQ_MIN}
          max={FREQ_MAX}
          isDisabled={!filter}
        />
        <Text position="absolute" top="22px" left="26px" whiteSpace="nowrap">{displayFreq(filterFreq)}</Text>
      </Box>

      <Flex>
        {
          filterQGainUsedFlags[filterType]["Q"] &&
          <Box flex={1}>
            <Text pt={3} pb={1}>Q</Text>
            <Box mx="auto" width="min-content" position="relative">
              <Knob
                value={filterQ}
                onChange={(v) => setFilterQ(clamp(filterQ + v, getQRange(filterType, "MIN"), getQRange(filterType, "MAX")))}
                min={getQRange(filterType, "MIN")}
                max={getQRange(filterType, "MAX")}
                size={30}
                isDisabled={!filter}
              />
              <Text position="absolute" top="16px" left="20px">{filterQ}</Text>
            </Box>
          </Box>
        }

        {
          filterQGainUsedFlags[filterType]["GAIN"] &&
            <Box flex={1}>
              <Text pt={3} pb={1}>Gain</Text>
              <Box mx="auto" width="min-content" position="relative">
                <Knob
                  value={filterGain}
                  onChange={(v) => setFilterGain(clamp(filterGain + v, getGainRange(filterType, "MIN"), getGainRange(filterType, "MAX")))}
                  min={getGainRange(filterType, "MIN")}
                  max={getGainRange(filterType, "MAX")}
                  size={30}
                  isDisabled={!filter}
                />
                <Text position="absolute" top="16px" left="20px">{filterGain}</Text>
              </Box>
            </Box>
        }
      </Flex>
    </>
  )
}
