import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Text,
  Box,
  Button,
  HStack,
  useMediaQuery,
  Spacer,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react';
import { useState } from 'react';

import { theme } from '@/libs/theme';
import { clamp, noteNumberToNoteName } from "@/libs/utils";
import { KeyboardScales, KeyboardScale, isKeyboardScale } from "@/types/synth"

interface Props {
  startAmp: (pitch: number) => void,
  stopAmp: () => void
}

export const Keyboard = ({
  startAmp,
  stopAmp,
}: Props) => {
  const [octave, setOctave] = useState<number>(3);
  const [keyboardScale, setKeyboardScale] = useState<KeyboardScale>("chromatic");
  const C1_NOTE_NUMBER = 12;
  const OCTAVE_MIN = 1;
  const OCTAVE_MAX = 8;

  const [isLargerWindow] = useMediaQuery('(min-width: 1080px)');
  // const scale = Array.from({length: 24}, (v, i) => i + C3_NOTE_NUMBER);

  return (
    <Box mt={4} mx="auto" p={4} textAlign="center" w="fit-content" bg={theme.colors.brand[900]} borderRadius="8px">
      {/* Controls */}
      <HStack borderRadius="full" mb={2} height="full">
        <Text fontSize="lg">Keyboard</Text>
        <Spacer />

        {/* Menu */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            size="sm"
            bg={theme.colors.brand[900]}
            color={"white"}
            borderColor={theme.colors.brand[400]}
            textAlign="left"
            _hover={{ bg: theme.colors.brand[800] }}
            _active={{ bg: theme.colors.brand[800] }}
            _expanded={{ bg: theme.colors.brand[800] }}
          >
            {keyboardScale}
          </MenuButton>
          <MenuList
            bg={theme.colors.brand[900]}
          // // borderColor={filter ? theme.colors.brand[400] : theme.colors.gray[400]}
          // // color={filter ? "white" : theme.colors.gray[400]}
          >
            <MenuOptionGroup
              defaultValue={keyboardScale}
              onChange={(value) => {
                const v = String(value);
                if (isKeyboardScale(v)) {
                  setKeyboardScale(v);
                }
              }}
            >
              {
                KeyboardScales.map((key, i) =>
                  <MenuItemOption
                    key={i}
                    bg={theme.colors.brand[900]}
                    value={key}
                  >
                    {key}
                  </MenuItemOption>
                )
              }
            </MenuOptionGroup>
          </MenuList>
        </Menu>

        {/* Octave */}
        <Divider orientation="vertical" height="1rem" borderColor="white" />
        <HStack mx="auto" bg={theme.colors.brand[800]} rounded="full" spacing={0} height="32px">
          <Button
            bg="#0000"
            h="full"
            borderLeftRadius="full"
            disabled={octave <= OCTAVE_MIN}
            _active={{ bg: theme.colors.brand[600] }}
            _hover={{ bg: theme.colors.brand[700] }}
            onClick={() => setOctave(clamp(octave - 1, OCTAVE_MIN, OCTAVE_MAX))}
          >-</Button>
          <Text px={1}>オクターブ {octave}</Text>
          <Button
            bg="#0000"
            h="full"
            borderRightRadius="full"
            disabled={octave >= OCTAVE_MAX}
            _active={{ bg: theme.colors.brand[600] }}
            _hover={{ bg: theme.colors.brand[700] }}
            onClick={() => setOctave(clamp(octave + 1, OCTAVE_MIN, OCTAVE_MAX))}
          >+</Button>
        </HStack>
        <Spacer />
      </HStack>
      <Box width="fit-content">
        {
          Array.from({ length: isLargerWindow ? 24 : 12 }, (v, i) => i + C1_NOTE_NUMBER + octave * 12).map((note, index) =>
            note <= 127 ?
              <Button
                key={index}
                w="20px"
                h="100px"
                bg={noteNumberToNoteName(note).includes("#") ? "black" : "white"}
                color={noteNumberToNoteName(note).includes("#") ? "white" : "black"}
                onMouseDown={() => {
                  startAmp(note);
                }}
                onMouseUp={() => {
                  stopAmp();
                }}
              >{noteNumberToNoteName(note)}</Button> :
              <Button
                isDisabled={false}
                key={index}
                w="20px"
                h="100px"
                bg={"gray.800"}
              ></Button>
          )
        }
      </Box>
    </Box>
  );
};
