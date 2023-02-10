import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  HStack,
  NumberInput,
  NumberInputField,
  Spacer
} from '@chakra-ui/react';

import { Knob } from '@/components/synth/knob';
import { theme } from '@/libs/theme';
import { capitalizeFirstLetter, clamp } from '@/libs/utils';
import { useSynth } from '@/providers/synth';
import { BasicOscillatorType, isBasicOscillatorType } from '@/types/synth';

// interface Props {
//   subOsc: boolean;
//   setSubOsc: (v: boolean) => void;
//   subOscGain: number;
//   setSubOscGain: (v: number) => void;
//   subOscType: "sync" | BasicOscillatorType;
//   setSubOscType: (v: "sync" | BasicOscillatorType) => void;
//   subOscOctave: number;
//   setSubOscOctave: (v: number) => void;
//   subOscTranspose: number;
//   setSubOscTranspose: (v: number) => void;
// }

export const SubOsc = ()  => {
  const {
    subOsc,
    setSubOsc,
    subOscGain,
    setSubOscGain,
    subOscType,
    setSubOscType,
    subOscOctave,
    setSubOscOctave,
    subOscTranspose,
    setSubOscTranspose,
  } = useSynth();

  return (
    <Flex direction="column" h="full">
      <Button
        variant="outline"
        w="full"
        h={8}
        bg={subOsc ? theme.colors.brand[400] : theme.colors.brand[600]}
        borderColor={theme.colors.brand[800]}
        borderRadius="0px"
        color={subOsc ? "black" : "white"}
        _focus={{bg: subOsc ? theme.colors.brand[400] : theme.colors.brand[600]}}
        _hover={{bg: subOsc ? theme.colors.brand[400] : theme.colors.brand[600]}}
        onClick={() => setSubOsc(!subOsc)}
      >
        Sub
      </Button>

      {/* <Spacer /> */}

      <Text pl={1}>Gain</Text>
      <Box position="relative" pl={1}>
        <Knob
          value={subOscGain}
          setValue={setSubOscGain}
          onChange={(v) => setSubOscGain(clamp(subOscGain + v, 0, 100))}
          min={0}
          max={100}
          isDisabled={!subOsc}
        />
        <Text position="absolute" top="22px" left="calc(1rem + 18px)">{subOscGain} %</Text>
      </Box>

      <Spacer />

      <Text>Tone</Text>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          w="90px"
          // variant="outline"
          size="xs"
          color={subOsc ? theme.colors.brand[500] : "white"}
          bg={theme.colors.brand[700]}
          borderColor={theme.colors.brand[800]}
          textAlign="left"
          _hover={{bg: theme.colors.brand[600]}}
          _active={{bg: theme.colors.brand[600]}}
          _expanded={{bg: theme.colors.brand[600]}}
        >
          {capitalizeFirstLetter(subOscType)}
        </MenuButton>
        <MenuList bg={theme.colors.brand[700]} borderColor={theme.colors.brand[800]}>
          <MenuOptionGroup
            defaultValue={subOscType}
            onChange={(value) => {
              const t = String(value);
              if (t == "sync" || isBasicOscillatorType(t)) {
                setSubOscType(t);
              }
            }}
          >
            <MenuItemOption bg={theme.colors.brand[700]} value='sync'>Sync</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[700]} value='sine'>Sine</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[700]} value='square'>Square</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[700]} value='sawtooth'>Sawtooth</MenuItemOption>
            <MenuItemOption bg={theme.colors.brand[700]} value='triangle'>Triangle</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

      <Spacer />

      <Text>Octave</Text>
      <ButtonGroup size='xs' variant='outline' spacing="1">
        {
          [0, -1, -2].map((v) =>
            <Button
              key={v}
              borderRadius="0"
              bg={subOscOctave == v ? (subOsc ? theme.colors.brand[400] : theme.colors.gray[400]) : theme.colors.brand[600]}
              borderColor={theme.colors.brand[800]}
              _focus={{bg: subOsc ? theme.colors.brand[400] : theme.colors.brand[600]}}
              _hover={{bg: subOsc ? theme.colors.brand[700] : theme.colors.brand[600]}}
              onClick={(e) => {setSubOscOctave(v); return e;}}
            >{v}</Button>
          )
        }
      </ButtonGroup>

      <Spacer />

      <Text>Transpose</Text>
      <HStack spacing="0.2rem" color="white">
        <NumberInput
          size="xs"
          variant="flushed"
          allowMouseWheel
          color={subOsc ? theme.colors.brand[500] : "white"}
          borderColor={subOsc ? theme.colors.brand[500] : "white"}
          focusBorderColor={subOsc ? theme.colors.brand[500] : "white"}
          min={-50}
          max={50}
          isValidCharacter={(v) => /^[0-9\-+]$/.test(v)}
          defaultValue={subOscTranspose}
          onBlur={(e) => {
            const v = Number(e.target.value);
            setSubOscTranspose(Math.floor(isNaN(v) ? 0 : v));
          }}
        >
          <NumberInputField p={1} w={8} textAlign="center"/>
        </NumberInput>
        <Text fontSize="14px">st</Text>
      </HStack>
    </Flex>
  );
};
