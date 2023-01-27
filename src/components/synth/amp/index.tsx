import {
  Box,
  Divider,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { ATTACK_MAX_MS, ATTACK_MIN_MS } from '@/providers/synth'
import { ADSRCanvas } from './adsrCanvas'
import { AmpInput } from './ampInput'

interface Props {
  attack: number,
  setAttack: (attack: number) => void,
  decay: number,
  setDecay: (decay: number) => void,
  sustain: number,
  setSustain: (sustain: number) => void,
  release: number,
  setRelease: (release: number) => void,
}

export const Amp = ({
  attack,
  setAttack,
  decay,
  setDecay,
  sustain,
  setSustain,
  release,
  setRelease
}: Props) => {
  return (
    <Box>
      <ADSRCanvas
        attack={attack}
        setAttack={setAttack}
        decay={decay}
        setDecay={setDecay}
        sustain={sustain}
        setSustain={setSustain}
        release={release}
        setRelease={setRelease}
      />

      <Divider />
      <Box pt={3}>
        <Flex>
          <AmpInput
            name="A"
            unit="ms"
            value={attack}
            max={ATTACK_MAX_MS}
            min={ATTACK_MIN_MS}
            onChange={(value) => setAttack(Number(value))}
          />
          <Spacer />
          <AmpInput
            name="D"
            unit="ms"
            value={decay}
            max={ATTACK_MAX_MS}
            min={ATTACK_MIN_MS}
            onChange={(value) => setDecay(Number(value))}
          />
          <Spacer />
          <AmpInput
            name="S"
            unit="%"
            value={sustain}
            max={100}
            min={0}
            onChange={(value) => setSustain(Number(value))}
          />
          <Spacer />
          <AmpInput
            name="R"
            unit="ms"
            value={release}
            max={ATTACK_MAX_MS}
            min={ATTACK_MIN_MS}
            onChange={(value) => setRelease(Number(value))}
          />
          <Spacer />
        </Flex>
      </Box>
    </Box>
  )
}
