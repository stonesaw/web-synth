import { theme } from '@/libs/theme';
import { BasicOscillatorType } from '@/providers/synth';
import { Box } from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react';


interface Props {
  type: BasicOscillatorType
}

export const WaveShapeCanvas = ({type}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.oncontextmenu = function () {return false;}
      const context = canvas.getContext('2d');
      if (context) {
        const w = canvas.width;
        const h = canvas.height;
        context.clearRect(0, 0, w, h);

        // line
        context.lineWidth = 2;
        context.strokeStyle = theme.colors.brand[400];

        if (type == "sine") {
          context.beginPath();
          context.moveTo(0, h / 2);
          context.quadraticCurveTo(w * 0.25, 0, w / 2, h / 2);
          context.quadraticCurveTo(w * 0.75, h, w, h / 2);
          context.stroke();
        } else if (type == "triangle") {
          context.beginPath();
          context.moveTo(0, h / 2);
          context.lineTo(w * 0.25, h * 0.25);
          context.lineTo(w * 0.75, h * 0.75);
          context.lineTo(w, h / 2);
          context.stroke();
        } else if (type == "sawtooth") {
          context.beginPath();
          context.moveTo(0, h * 0.5);
          context.lineTo(w * 0.5, h * 0.25);
          context.lineTo(w * 0.5, h * 0.75);
          context.lineTo(w, h / 2);
          context.stroke();
        } else if (type == "square") {
          context.beginPath();
          context.moveTo(0, h * 0.25);
          context.lineTo(w * 0.5, h * 0.25);
          context.lineTo(w * 0.5, h * 0.75);
          context.lineTo(w, h * 0.75);
          context.stroke();
        } else { // error
          context.beginPath();
          context.moveTo(0, h / 2);
          context.lineTo(w, h / 2);
          context.stroke();
        }
      }
    }
  }, [type])

  return (
    <Box pt={1}>
      <canvas width="160px" height="160px" ref={canvasRef}></canvas>
    </Box>
  )
}
