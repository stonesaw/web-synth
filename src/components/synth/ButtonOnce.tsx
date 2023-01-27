import { Button } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode;
  flag: boolean;
  onClick: () => void;
}

export const ButtonOnce = ({children, flag, onClick}: Props)  => {
  return (
    (
      flag ? <Button onClick={() => onClick()}>{children}</Button> : <></>
    )
  )
}
