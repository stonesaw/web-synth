import {
  Text,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  HStack,
  Flex,
} from '@chakra-ui/react';

import { theme } from '@/libs/theme';

interface Props {
  gain: number,
  setGain: (gain: number) => void
}

export const GainSlider = ({
  gain,
  setGain
}: Props) => {
  const handleChange = (value: number) => setGain(value);
  // const MAX = 6;
  // const MIN = -40;
  const MAX = 100;
  const MIN = 0;

  return (
    <Flex direction="column" pt={2} textAlign="center" h="full">
      <Text w="80px" m="0">Gain</Text>
      <Box h="full" p={4}>
        <Slider
          aria-label='gain-slider'
          focusThumbOnChange={false}
          orientation='vertical'
          max={MAX}
          min={MIN}
          value={gain}
          onChange={(value) => handleChange(value)}
        >
          <SliderTrack bg="gray.600">
            <SliderFilledTrack bg={theme.colors.brand[400]} />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>

      <HStack justifyContent="center">
        <NumberInput
          size="xs"
          variant="flushed"
          allowMouseWheel
          borderColor={theme.colors.brand[400]}
          focusBorderColor={theme.colors.brand[400]}
          max={MAX}
          min={MIN}
          value={gain}
          onChange={(value) => handleChange(Number(value))}
        >
          <NumberInputField p={1} w={10} textAlign="center"/>
        </NumberInput>
        <Text>%</Text>
      </HStack>
    </Flex>
  );
};

export default GainSlider;
