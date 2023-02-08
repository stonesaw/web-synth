import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  HStack,
  NumberInput,
  NumberInputField,
  Grid,
  GridItem,
  VStack,
} from '@chakra-ui/react'

import { theme } from '@/libs/theme'
import { capitalizeFirstLetter, clamp } from '@/libs/utils'
import { PropertyMatrix, modulations, modulationsType } from '@/providers/synth'

interface Props {
  propertyMatrix: PropertyMatrix;
  setPropertyMatrix: (v: PropertyMatrix) => void;
}

export const Matrix = ({
  propertyMatrix,
  setPropertyMatrix
}: Props)  => {
  return (
    <HStack spacing={2} height="calc(100% - 17.5px)" alignItems="flex-start">
      {/* Matrix keys */}
      <VStack spacing={1}>
        <Box
          w='100px'
          h='8'
          pl={1}
        ></Box>
        {
          Object.keys(propertyMatrix).map((v, i) =>
          <Box
            key={i}
            w='100px'
            h='6'
            pl={1}
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
              <Box
                key={i}
                w='70px'
                h='8'
                // bg={theme.colors.brand[800]}
                borderBottom="2px"
                borderColor={i < 3 ? theme.colors.brand[500] : theme.colors.brand[400]}
                textAlign="center"
              >
                <Text>{v}</Text>
              </Box>
            )
          }
        </HStack>

        {
          Object.values(propertyMatrix).map((mods, i) =>
          <HStack spacing={1} key={i}>
            {
              modulations.map((mod: modulationsType, i) =>
                <Box
                  key={i}
                  w='70px'
                  h='6'
                  bg={theme.colors.brand[800]}
                  // borderBottom="2px"
                  // borderColor={i < 3 ? theme.colors.brand[500] : theme.colors.brand[400]}
                  textAlign="center"
                >
                  <Text>{mods[mod]}</Text>
                </Box>
              )
            }
          </HStack>
          )
        }
      </VStack>

    </HStack>
  )
}
