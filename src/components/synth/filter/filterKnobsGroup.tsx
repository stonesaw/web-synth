import {
  Box,
  Divider,
  Flex
} from '@chakra-ui/react';

import { FilterKnobs } from './filterKnobs';

import { useSynth } from '@/providers/synth';


export const FilterKnobsGroup = () => {
  const {
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
  } = useSynth();

  return (
    <Box py={2} height="calc(100% - 100px - 30px)" fontSize="14px">
      <Flex h="full" alignSelf="stretch">
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
  );
};
