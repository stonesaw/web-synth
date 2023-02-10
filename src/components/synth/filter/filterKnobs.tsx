import {
  Text,
  Box,
  Flex
} from '@chakra-ui/react';

import { FrequencyKnob } from '@/components/synth/frequencyKnob';
import { Knob } from '@/components/synth/knob';
import { clamp } from '@/libs/utils';
import { filterQGainUsedFlags, FILTER_FREQ_MIN, FILTER_FREQ_MAX, DEFAULT_Q_MAX, DEFAULT_Q_MIN, DEFAULT_GAIN_MAX, DEFAULT_GAIN_MIN } from '@/types/synth';

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
  const displayFreq = (freq: number) => {
    if (freq < 1000) {
      return String(freq) + "Hz";
    } else {
      return String(freq / 1000) + "kHz";
    }
  };

  const getQRange = (filterType: BiquadFilterType, minmax: "MIN" | "MAX") => {
    const qRange = filterQGainUsedFlags[filterType]["Q_RANGE"];
    if (qRange) {
      return qRange[minmax];
    } else {
      return (minmax == "MAX" ? DEFAULT_Q_MAX : DEFAULT_Q_MIN);
    }
  };

  const getGainRange = (filterType: BiquadFilterType, minmax: "MIN" | "MAX") => {
    const gainRange = filterQGainUsedFlags[filterType]["GAIN_RANGE"];
    if (gainRange) {
      return gainRange[minmax];
    } else {
      return (minmax == "MAX" ? DEFAULT_GAIN_MAX : DEFAULT_GAIN_MIN);
    }
  };

  return (
    <>
      <Text pb={1}>Frequency</Text>
      <Box ml={4} w="min-content" position="relative">
        <FrequencyKnob
          value={filterFreq}
          setValue={setFilterFreq}
          // https://webaudioapi.com/samples/frequency-response/
          onChange={(v) => setFilterFreq(v)}
          min={FILTER_FREQ_MIN}
          max={FILTER_FREQ_MAX}
          defaultValue={8000}
          isDisabled={!filter}
        />
        <Text position="absolute" top="22px" left="26px" whiteSpace="nowrap">{displayFreq(filterFreq)}</Text>
      </Box>

      <Flex>
        {
          filterQGainUsedFlags[filterType]["Q"] &&
          <Box flex={1}>
            <Text pt={3} pb={1}>Q</Text>
            <Box mx="auto" w="min-content" position="relative">
              <Knob
                value={filterQ}
                setValue={setFilterQ}
                onChange={(v) => setFilterQ(clamp(filterQ + v, getQRange(filterType, "MIN"), getQRange(filterType, "MAX")))}
                min={getQRange(filterType, "MIN")}
                max={getQRange(filterType, "MAX")}
                defaultValue={5}
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
              <Box mx="auto" w="min-content" position="relative">
                <Knob
                  value={filterGain}
                  setValue={setFilterGain}
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
  );
};
