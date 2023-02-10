import {
  Box,
  Divider,
  Flex,
} from '@chakra-ui/react';

import { FilterMenuMenu } from './filterMenuMenu';

import { theme } from '@/libs/theme';

interface Props {
  filter1: boolean,
  setFilter1: (v: boolean) => void,
  filter1Type: BiquadFilterType,
  setFilter1Type: (v: BiquadFilterType) => void,
  filter2: boolean,
  setFilter2: (v: boolean) => void,
  filter2Type: BiquadFilterType,
  setFilter2Type: (v: BiquadFilterType) => void,
}

export const FilterMenu = ({
  filter1,
  setFilter1,
  filter1Type,
  setFilter1Type,
  filter2,
  setFilter2,
  filter2Type,
  setFilter2Type,
}: Props) => {
  return (
    <Box w="full" height="34.4px" bg={theme.colors.brand[900]} borderTopRadius="8px">
      <Flex alignSelf="stretch" h="full">
        <FilterMenuMenu
          filter={filter1}
          setFilter={setFilter1}
          filterType={filter1Type}
          setFilterType={setFilter1Type}
        />

        <Divider color="white" orientation="vertical" height="80%" transform="translateY(10%)" />

        <FilterMenuMenu
          filter={filter2}
          setFilter={setFilter2}
          filterType={filter2Type}
          setFilterType={setFilter2Type}
        />
      </Flex>
    </Box>
  );
};
