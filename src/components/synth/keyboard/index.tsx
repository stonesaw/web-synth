import { theme } from '@/libs/theme';
import {
  Text,
  Box,
  Button
} from '@chakra-ui/react'
import { useState } from 'react';
import { noteNumberToNoteName } from "@/libs/utils"

interface Props {
  startAmp: (pitch: number) => void,
  stopAmp: () => void
}

export const Keyboard = ({
  startAmp,
  stopAmp,
}: Props) => {
  const [octave, setOctave] = useState(3);
  const C3_NOTE_NUMBER = 48
  const scale = Array.from({length: 24}, (v, i) => i + C3_NOTE_NUMBER);

  return (
    <Box py={2} px={1} textAlign="center" height="100%">
      {
        scale.map((note, index) =>
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
          >{noteNumberToNoteName(note)}</Button>
        )
      }
    </Box>
  )
}
