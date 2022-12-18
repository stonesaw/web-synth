import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  StackDivider,
  Text,
  Stack,
  Box,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'

const GainSlider = () => {

  return (
    <Box backgroundColor="gray.100">
      <Text w="80px" m="0">Gain: 0.0dB</Text>
      <Slider
        aria-label='gain-slider'
        defaultValue={30}
        orientation='vertical'
        minH='32'
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  )
}

export default GainSlider
