import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react';

import { theme } from '@/libs/theme';
import { isBiquadFilterType } from '@/types/synth';

interface Props {
  filter: boolean,
  setFilter: (v: boolean) => void,
  filterType: BiquadFilterType,
  setFilterType: (v: BiquadFilterType) => void,
}

export const FilterMenuMenu = ({
  filter,
  setFilter,
  filterType,
  setFilterType
}: Props) => {
  return (
    <HStack flex={1} p={1}>
      <Button
        variant="outline"
        size="xs"
        p={0}
        bg={filter ? theme.colors.brand[400] : "#0000"}
        borderWidth="1px"
        borderRadius="0px"
        borderColor={theme.colors.brand[400]}
        _focus={{bg: filter ? theme.colors.brand[400] : "#0000"}}
        _hover={{bg: filter ? theme.colors.brand[400] : "#0000"}}
        onClick={() => setFilter(!filter)}
      ></Button>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          size="xs"
          bg={theme.colors.brand[900]}
          color={filter ? "white" : theme.colors.gray[400]}
          borderColor={theme.colors.brand[400]}
          textAlign="left"
          _hover={{bg: theme.colors.brand[800]}}
          _active={{bg: theme.colors.brand[800]}}
          _expanded={{bg: theme.colors.brand[800]}}
        >
          {filterType}
        </MenuButton>
        <MenuList
          bg={theme.colors.brand[900]}
          borderColor={filter ? theme.colors.brand[400] : theme.colors.gray[400]}
          color={filter ? "white" : theme.colors.gray[400]}
        >
          <MenuOptionGroup
            defaultValue={filterType}
            onChange={(value) => {
              const t = String(value);
              if (isBiquadFilterType(t)) { setFilterType(t); }
            }}
          >
            <MenuItemOption bg={theme.colors.brand[900]} value='lowpass'>lowpass</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[900]} value='highpass'>highpass</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[900]} value='bandpass'>bandpass</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[900]} value='lowshelf'>lowshelf</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[900]} value='highshelf'>highshelf</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[900]} value='peaking'>peaking</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[900]} value='notch'>notch</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[900]} value='allpass'>allpass</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </HStack>
  );
};
