import { theme } from '@/libs/theme';
import {
  Text,
  Box,
  Button
} from '@chakra-ui/react'
import { useState } from 'react';
import { noteNameToFrequency } from "@/libs/utils"

interface Props {
  startAmp: (pitch: number) => void,
  stopAmp: () => void
}

export const Keyboard = ({
  startAmp,
  stopAmp,
}: Props) => {
  const scale = [
    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
  ];

  return (
    <Box py={2} px={1} textAlign="center" height="100%">
      {
        scale.map((note, index) =>
          <Button
            key={index}
            width="20px"
            height="100px"
            bg={note.includes("#") ? "black" : "white"}
            color={note.includes("#") ? "white" : "black"}
            onMouseDown={() => {
              startAmp(noteNameToFrequency(note));
            }}
            onMouseUp={() => {
              stopAmp();
            }}
          >{note}</Button>
        )
      }
    </Box>
  )
}
