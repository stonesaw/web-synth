import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';


import { theme } from '@/libs/theme';
import { useSynth } from '@/providers/synth';
import { PropertyMatrix, modulations, modulationsType } from '@/types/synth';

interface Props {
  setAmpTabIndex: (v: number) => void;
}

export const Matrix = ({
  setAmpTabIndex
}): Props  => {
  const {
    propertyMatrix,
    setPropertyMatrix
  } = useSynth();

  return (
    <HStack height="100%" spacing={2} alignItems="flex-start" overflowY="scroll" pr={1}>
      {/* Matrix key - assignable value names */}
      <VStack spacing={1}>
        <Box
          w='110px'
          h='8'
          pl={1}
        ></Box>
        {
          Object.keys(propertyMatrix).map((v, i) =>
          <Box
            key={i}
            w='110px'
            h='6'
            pl={1}
            color={theme.colors.brand[600]}
            whiteSpace="nowrap"
          >
            <Text>{v}</Text>
          </Box>
          )
        }
      </VStack>

      <VStack spacing={1}>
        <HStack spacing={1}>
          {
            modulations.map((v, i) =>
              <Button
                key={i}
                w='70px'
                h='8'
                borderBottom="2px"
                borderColor={i < 3 ? theme.colors.brand[500] : theme.colors.brand[400]}
                textAlign="center"
                bg="#0000"
                borderRadius="0px"
                onClick={(_e) => setAmpTabIndex(i)}
                _hover={{bg: "#0000"}}
                _active={{bg: "#0000"}}
                fontWeight="normal"
              >
                <Text>{v}</Text>
              </Button>
            )
          }
        </HStack>

        {
          Object.keys(propertyMatrix).map((name) =>
          <HStack spacing={1} key={name}>
            {
              modulations.map((mod: modulationsType, i) =>
                <NumberInput
                  key={i}
                  allowMouseWheel
                  variant="flushed"
                  value={propertyMatrix[name][mod]}
                  min={-100}
                  max={100}
                  onChange={(v) => {
                    console.log(i, name, Number(v));
                    setPropertyMatrix(
                      {...propertyMatrix, [name]: {...propertyMatrix[name], [mod]: Number(v)}}
                    )
                  }}
                >
                  <NumberInputField
                    w="70px"
                    h="6"
                    p={1}
                    color="white"
                    bg={theme.colors.brand[800]}
                    textAlign="center"
                  />
                </NumberInput>
              )
            }
          </HStack>
          )
        }
      </VStack>

    </HStack>
  );
};
