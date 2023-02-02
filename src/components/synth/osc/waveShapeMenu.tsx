import { useState } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons';

import { theme } from '@/libs/theme';
import { capitalizeFirstLetter } from '@/libs/utils'
import { BasicOscillatorType, isBasicOscillatorType } from '@/providers/synth';

interface Props {
  type: BasicOscillatorType,
  setType: (type: BasicOscillatorType) => void
}

export const WaveShapeMenu = ({
  type,
  setType
}: Props) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        w="100%"
        variant="outline"
        bg={theme.colors.brand[900]}
        borderColor={theme.colors.brand[400]}
        textAlign="left"
        _hover={{bg: theme.colors.brand[800]}}
        _active={{bg: theme.colors.brand[800]}}
        _expanded={{bg: theme.colors.brand[800]}}
      >
        {capitalizeFirstLetter(type)}
      </MenuButton>
      <MenuList bg={theme.colors.brand[900]} borderColor={theme.colors.brand[400]}>
        <MenuOptionGroup
          defaultValue='sine'
          onChange={(value) => {
            const t = String(value);
            if (isBasicOscillatorType(t)) { setType(t); }
          }}
        >
          <MenuItemOption bg={theme.colors.brand[900]} value='sine'>Sine</MenuItemOption>
          <MenuItemOption bg={theme.colors.brand[900]} value='square'>Square</MenuItemOption>
          <MenuItemOption bg={theme.colors.brand[900]} value='sawtooth'>Sawtooth</MenuItemOption>
          <MenuItemOption bg={theme.colors.brand[900]} value='triangle'>Triangle</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
