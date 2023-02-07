import { useState } from 'react';
import {
  Text,
  Box,
  HStack,
  Divider,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';

import { theme } from '@/libs/theme';
import { clamp } from '@/libs/utils';
import { Knob } from '@/components/synth/knob';
import { FilterMenuMenu } from './filterMenuMenu';

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
    <Box width="100%" height="34.4px" bg={theme.colors.brand[900]} borderTopRadius="8px">
      <Flex alignSelf="stretch" height="100%">
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
  )
}
