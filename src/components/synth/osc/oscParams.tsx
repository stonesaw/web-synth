import {
  Text,
  NumberInput,
  NumberInputField,
  HStack,
} from '@chakra-ui/react'
import { theme } from '@/libs/theme'

interface Props {
  semi: number,
  setSemi: (semi: number) => void,
  detune: number,
  setDetune: (detune: number) => void,
}

export const OscParams = ({
  semi,
  setSemi,
  detune,
  setDetune,
}: Props) => {
  return (
    <HStack pt={2}>
      <HStack spacing="0.2rem" color={theme.colors.brand[400]}>
        <Text fontSize="14px" color="gray.300">Semi</Text>
        <NumberInput
          size="xs"
          variant="flushed"
          allowMouseWheel
          borderColor={theme.colors.brand[400]}
          focusBorderColor={theme.colors.brand[400]}
          min={-24}
          max={24}
          isValidCharacter={(v) => /^[0-9\-+]$/.test(v)}
          defaultValue={semi}
          onBlur={(e) => {
            const v = Number(e.target.value);
            setSemi(Math.floor(isNaN(v) ? 0 : v));
          }}
        >
          <NumberInputField p={1} w={8} textAlign="center"/>
        </NumberInput>
        <Text fontSize="14px">st</Text>
      </HStack>

      <HStack spacing="0.2rem" color={theme.colors.brand[400]}>
        <Text fontSize="14px" color="gray.300">Det</Text>
        <NumberInput
          size="xs"
          variant="flushed"
          allowMouseWheel
          borderColor={theme.colors.brand[400]}
          focusBorderColor={theme.colors.brand[400]}
          min={-50}
          max={50}
          isValidCharacter={(v) => /^[0-9\-+]$/.test(v)}
          defaultValue={detune}
          onBlur={(e) => {
            const v = Number(e.target.value);
            setDetune(Math.floor(isNaN(v) ? 0 : v));
          }}
        >
          <NumberInputField p={1} w={8} textAlign="center"/>
        </NumberInput>
        <Text fontSize="14px">ct</Text>
      </HStack>
    </HStack>
  )
}
