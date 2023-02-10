import { QuestionIcon } from '@chakra-ui/icons';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  HStack,
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tooltip,
  Divider,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useState } from 'react';

import { ButtonOnce } from '@/components/synth/ButtonOnce';
import { Amp } from '@/components/synth/amp/';
import { FilterCanvas } from '@/components/synth/filter/filterCanvas';
import { FilterKnobsGroup } from '@/components/synth/filter/filterKnobsGroup';
import { FilterMenu } from '@/components/synth/filter/filterMenu';
import { Keyboard } from '@/components/synth/keyboard';
import { Matrix } from '@/components/synth/matrix';
import { GainSlider } from '@/components/synth/osc/gainSlider';
import { OscParams } from '@/components/synth/osc/oscParams';
import { WaveShapeCanvas } from '@/components/synth/osc/waveShapeCanvas';
import { WaveShapeMenu } from '@/components/synth/osc/waveShapeMenu';
import { SubOsc } from '@/components/synth/subOsc';
import { theme } from '@/libs/theme';
import { clamp, noteNumberToFrequency, percentToFrequency } from '@/libs/utils';
import { useSynth, SynthProvider } from '@/providers/synth';
import { BasicOscillatorType, FILTER_FREQ_MAX, FILTER_FREQ_MIN, PropertyMatrix } from '@/types/synth';


interface AutomatableParam {
  value: number;
  MAX: number;
  MIN: number;
  unit: string;
}

const Synth = () => {
  const {
    audioCtx,
    initAudio,
    startAmp,
    stopAmp,
    attack,
    setAttack,
    decay,
    setDecay,
    sustain,
    setSustain,
    release,
    setRelease,
    // env1
    env1Attack,
    setEnv1Attack,
    env1Decay,
    setEnv1Decay,
    env1Sustain,
    setEnv1Sustain,
    env1Release,
    setEnv1Release,
    // env2
    env2Attack,
    setEnv2Attack,
    env2Decay,
    setEnv2Decay,
    env2Sustain,
    setEnv2Sustain,
    env2Release,
    setEnv2Release,
  } = useSynth();
  const [ampTabIndex, setAmpTabIndex] = useState(0);

  return (
    // <SynthProvider>
      <Card bg={theme.colors.brand[600]} color="white">
        <CardHeader>
          <ButtonOnce
            flag={!audioCtx}
            onClick={() => initAudio()}
          >
            Load Web Audio API (Click here!)
          </ButtonOnce>
          <Heading size='md'>Web Synthesizer (Beta)</Heading>
        </CardHeader>

        <CardBody pt={0}>
          <Box overflowX="auto" overflowY="hidden">
            <HStack spacing="10px" align="start" height="300px" minWidth="min-content">
              {/* Sub */}
              <Box bg={theme.colors.brand[700]} color="white" p={2} pb={4} borderRadius="8px" minWidth="100px" h="full">
                <SubOsc />
              </Box>

              {/* OSC */}
              <Flex direction="column" bg={theme.colors.brand[900]} color={theme.colors.brand[400]} borderRadius="8px" p={2} pb={4} h="full">
                <Heading size='xs'>
                  OSC1{" "}
                  <Tooltip label='オシレーター：波形を選ぼう'>
                    <QuestionIcon color={theme.colors.brand[700]} />
                  </Tooltip>
                </Heading>
                <HStack h="full" align="start" spacing={0}>
                  <GainSlider />
                  <Flex direction="column" px={2} pt={2} h="full">
                    <WaveShapeMenu />
                    <Spacer />
                    <WaveShapeCanvas />
                    <Divider />
                    <OscParams />
                  </Flex>
                </HStack>
              </Flex>

              {/* Filter */}
              <Box bg={theme.colors.brand[800]} color="white" borderRadius="8px" h="full" >
                <FilterMenu />
                <FilterCanvas />
                <FilterKnobsGroup />
              </Box>

              {/* <Tabs>
                <TabList>
                  <Tab _active={{background: "#0000"}}>
                    Mod Source
                  </Tab>
                  <Tab _active={{background: "#0000"}}>
                    Matrix
                  </Tab>
                  </TabList>
                  <TabPanels color="white">
                  <TabPanel h="full"> */}

              {/* Amp, Env */}
              <Box bg={theme.colors.brand[900]} color="white" p={1} borderRadius="8px" h="full">
                <Tabs
                  index={ampTabIndex}
                  onChange={(e) => setAmpTabIndex(e)}
                  colorScheme="cyan"
                  color={theme.colors.brand[700]}
                  borderBottomColor={theme.colors.brand[700]}
                  height="calc(100% - 35.5px)"
                >
                  <TabList>
                    <Tab _active={{background: "#0000"}}>
                      <Heading size='xs'>
                        AMP{" "}
                        <Tooltip label='アンプ：音の時間的な変化を設定できる'>
                          <QuestionIcon color={theme.colors.brand[700]} />
                        </Tooltip>
                      </Heading>
                    </Tab>
                    <Tab _active={{background: "#0000"}}>
                      <Heading size='xs'>
                        ENV1{" "}
                        <Tooltip label='エンベロープ：フィルターなどに使える'>
                          <QuestionIcon color={theme.colors.brand[700]} />
                        </Tooltip>
                      </Heading>
                    </Tab>
                    <Tab _active={{background: "#0000"}}>
                      <Heading size='xs'>
                        ENV2
                      </Heading>
                    </Tab>
                    <Tab _active={{background: "#0000"}}>
                      <Heading size='xs'>
                        LFO1
                      </Heading>
                    </Tab>
                    <Tab _active={{background: "#0000"}}>
                      <Heading size='xs'>
                        LFO2
                      </Heading>
                    </Tab>
                  </TabList>
                  <TabPanels color="white" h="full">
                    <TabPanel p={4} h="full">
                      <Amp
                        attack={attack}
                        setAttack={setAttack}
                        decay={decay}
                        setDecay={setDecay}
                        sustain={sustain}
                        setSustain={setSustain}
                        release={release}
                        setRelease={setRelease}
                      />
                    </TabPanel>
                    <TabPanel p={4} h="full">
                      <Amp
                        attack={env1Attack}
                        setAttack={setEnv1Attack}
                        decay={env1Decay}
                        setDecay={setEnv1Decay}
                        sustain={env1Sustain}
                        setSustain={setEnv1Sustain}
                        release={env1Release}
                        setRelease={setEnv1Release}
                      />
                    </TabPanel>
                    <TabPanel p={4} h="full">
                      <Amp
                        attack={env2Attack}
                        setAttack={setEnv2Attack}
                        decay={env2Decay}
                        setDecay={setEnv2Decay}
                        sustain={env2Sustain}
                        setSustain={setEnv2Sustain}
                        release={env2Release}
                        setRelease={setEnv2Release}
                      />
                    </TabPanel>
                    <TabPanel p={4} h="full">
                      <Box minWidth="340px">
                        <Text pt='2' fontSize='sm'>
                          LFO1：フィルターなどに使える
                        </Text>
                      </Box>
                    </TabPanel>
                    <TabPanel p={4} h="full">
                      <Box minWidth="340px">
                        <Text pt='2' fontSize='sm'>
                          LFO2：フィルターなどに使える
                        </Text>
                      </Box>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>

              {/* </TabPanel>
              <TabPanel h="full"> */}
                {/* Matrix */}
                <Flex direction="column" bg={theme.colors.brand[900]} color="white" p={2} borderRadius="8px" h="full">
                  <Heading size='xs'>
                    Matrix{" "}
                    <Tooltip label='マトリックス：フィルターなどをエンベロープで動かすためのルーティングを設定します'>
                      <QuestionIcon color={theme.colors.brand[700]} />
                    </Tooltip>
                  </Heading>

                  <Matrix setAmpTabIndex={setAmpTabIndex} />
                </Flex>

              {/* </TabPanel>
              </TabPanels>
              </Tabs> */}

            </HStack>
          </Box>


          <Keyboard startAmp={startAmp} stopAmp={stopAmp} />
        </CardBody>
      </Card>
    // </SynthProvider>
  );
};

export default Synth;
