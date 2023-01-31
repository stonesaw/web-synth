import { useState, useEffect, useRef } from 'react';
import { theme } from '@/libs/theme';
import { get } from 'https';

interface Props {
  audioCtx: AudioContext | null,
  analyzeData: Uint8Array,
  filterFreq: number,
  filterQ: number,
}

export const FilterCanvas = ({
  audioCtx,
  analyzeData,
  filterFreq,
  filterQ,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const MAX = 12000;
  const MIN = 0;

  useEffect(() => {
    // console.log("a");
    if (!audioCtx) { return }
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.oncontextmenu = function () {return false;}
      const context = canvas.getContext('2d');
      if (context) {
          const w = canvas.width;
          const h = canvas.height;
          context.clearRect(0, 0, w, h);

          // analyze data
          // context.fillStyle = theme.colors.brand[700];
          // for(let i = 0; i < 512; ++i) {
          //     let y = (analyzeData[i] / 255);
          //     context.fillRect(i, h * (1 - y), 1, h);
          // }

          // line
          let lpf = filterFreq / MAX;
          let x = w * lpf;
          let y = h * (1 - filterQ / 50);
          context.lineWidth = 2;
          context.strokeStyle = theme.colors.brand[400];
          context.beginPath();
          context.moveTo(0, h * 0.5);
          context.lineTo(x - 30, h * 0.5);
          context.bezierCurveTo(x - 10, h * 0.5, x, y, x, h);
          // context.bezierCurveTo(mx - 10, h * 0.5, mx, my, mx, h);
          context.stroke();
        // }, 100))
      }
    }
  }, [audioCtx, filterFreq, filterQ])

  return <canvas width="220px" height="100px" ref={canvasRef} style={{"background": theme.colors.brand[900]}} />
}
