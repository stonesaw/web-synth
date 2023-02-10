import {
  Text,
  VStack,
  NumberInput,
  NumberInputField,
  HStack,
} from '@chakra-ui/react';

interface Props {
  name: string,
  unit: string,
  value: number,
  min: number,
  max: number,
  onChange: (value: string) => void
}

export const AmpInput = ({
  name,
  unit,
  value,
  min,
  max,
  onChange
}: Props) => {
  return (
    <VStack align="start" spacing={1}>
      <Text fontSize="14px" color="gray.300">{name}</Text>
      <HStack spacing="0.2rem" color="cyan.300">
        <NumberInput
          size="xs"
          variant="flushed"
          allowMouseWheel
          borderColor="cyan.400"
          focusBorderColor="cyan.300"
          min={min}
          max={max}
          value={value}
          onChange={(v) => onChange(v)}
        >
          <NumberInputField p={1} w={10} textAlign="center"/>
        </NumberInput>
        <Text fontSize="14px">{unit}</Text>
      </HStack>
    </VStack>
  );
};
