import { theme } from '@/libs/theme';
import {
  Text,
  Box,
  Button,
  HStack,
  useMediaQuery
} from '@chakra-ui/react'
import { useState } from 'react';
import { clamp, noteNumberToNoteName } from "@/libs/utils"

interface Props {
  startAmp: (pitch: number) => void,
  stopAmp: () => void
}

export const Keyboard = ({
  startAmp,
  stopAmp,
}: Props) => {
  const [octave, setOctave] = useState<number>(3);
  const C1_NOTE_NUMBER = 12;
  const OCTAVE_MIN = 1;
  const OCTAVE_MAX = 8;

  const [isLargerWindow] = useMediaQuery('(min-width: 1080px)')
  // const scale = Array.from({length: 24}, (v, i) => i + C3_NOTE_NUMBER);

  return (
    <Box mt={4} py={2} px={1} textAlign="center" height="100%" bg={theme.colors.brand[900]} borderRadius="8px">
      {/* Controls */}
      <HStack borderRadius="full">
        <Button
          colorScheme='whiteAlpha'
          borderLeftRadius="full"
          disabled={octave <= OCTAVE_MIN}
          onClick={() => setOctave(clamp(octave - 1, OCTAVE_MIN, OCTAVE_MAX))}
          >-</Button>
        <Text>オクターブ {octave}</Text>
        <Button
          colorScheme='whiteAlpha'
          borderRightRadius="full"
          disabled={octave >= OCTAVE_MAX}
          onClick={() => setOctave(clamp(octave + 1, OCTAVE_MIN, OCTAVE_MAX))}
        >+</Button>
      </HStack>
      {/* <Box> */}
        {
          Array.from({length: isLargerWindow ? 24 : 12}, (v, i) => i + C1_NOTE_NUMBER + octave * 12).map((note, index) =>
            note <= 127 ?
            <Button
              key={index}
              width="20px"
              height="100px"
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
              width="20px"
              height="100px"
              bg={"gray.800"}
            ></Button>
          )
        }
      {/* </Box> */}
    </Box>
  )
}
