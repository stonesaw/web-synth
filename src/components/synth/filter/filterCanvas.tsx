import { useState, useEffect, useRef } from 'react';
import { theme } from '@/libs/theme';
import { get } from 'https';

interface Props {
  audioCtx: AudioContext | null,
  analyser: AnalyserNode | null,
  filterFreq: number,
  filterQ: number,
}

export const FilterCanvas = ({
  audioCtx,
  analyser,
  filterFreq,
  filterQ,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [intervalID, setIntervalID] = useState<any>(null);
  const MAX = 20000;
  const MIN = 0;

  useEffect(() => {
    console.log("a");
    if (!audioCtx || !analyser) { return }
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.oncontextmenu = function () {return false;}
      const context = canvas.getContext('2d');
      if (context) {
        // setIntervalID(setInterval(() => {
          let analyzeData = new Float32Array(1024);
          analyser.getFloatFrequencyData(analyzeData);

          const w = canvas.width;
          const h = canvas.height;
          context.clearRect(0, 0, w, h);

          // analyze data
          context.fillStyle = theme.colors.brand[700];
          for(var i = 0; i < 512; ++i) {
              var f = audioCtx.sampleRate * i / 1024;
              let y = (analyzeData[i] + 48.16) * 2.56;
              // console.log((analyzeData[i] + 48.16) * 2.56);
              context.fillRect(i, h - y, 1, y);
          }
          // context.fillStyle = "#ff8844";
          // for(var d = -50; d < 50; d += 10) {
          //     var y = 128 - (d * 256 / 100) | 0;
          //     context.fillRect(20, y, 512, 1);
          //     context.fillText(d + "dB", 5, y);
          // }
          // context.fillRect(20, 128, 512, 1);
          // for(var f = 2000; f < audioCtx.sampleRate / 2; f += 2000) {
          //     var x = (f * 1024 / audioCtx.sampleRate) | 0;
          //     context.fillRect(x, 0, 1, 245);
          //     context.fillText(f + "Hz", x - 10, h);
          // }

          // line
          context.lineWidth = 2;
          context.strokeStyle = theme.colors.brand[400];

          let lpf = filterFreq / MAX;
          let x = w * lpf;
          let y = h * (1 - filterQ / 50);
          context.beginPath();
          context.moveTo(0, h * 0.5);
          context.lineTo(x - 30, h * 0.5);
          context.bezierCurveTo(x - 10, h * 0.5, x, y, x, h);
          // context.bezierCurveTo(mx - 10, h * 0.5, mx, my, mx, h);
          context.stroke();
        // }, 100))
      }
    }
  })

  return <canvas width="220px" height="100px" ref={canvasRef} style={{"background": theme.colors.brand[900]}} />
}
