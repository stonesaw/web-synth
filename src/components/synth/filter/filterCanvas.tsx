import { useEffect, useRef } from 'react';

import { theme } from '@/libs/theme';
import { useSynth } from '@/providers/synth';

export const FilterCanvas = () => {
  const {
    audioCtx,
    filter1Node,
    filter1,
    filter1Type,
    filter1Freq,
    filter1Q,
    filter1Gain,
    filter2Node,
    filter2,
    filter2Type,
    filter2Freq,
    filter2Q,
    filter2Gain,
  } = useSynth();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const MAX = 20500;
  const MIN = 0;
  const dbScale = 30;

  const drawFilterCurve = (
    context: CanvasRenderingContext2D,
    w: number,
    h: number,
    nyquist: number,
    filterNode: BiquadFilterNode,
    filter: boolean,
    color: string
  ) => {
    const pixelsPerDb = (0.5 * h) / dbScale;
    const noctaves = 11;

    const frequencyHz = new Float32Array(w);
    const magResponse = new Float32Array(w);
    const phaseResponse = new Float32Array(w);
    // First get response.
    for (let i = 0; i < w; ++i) {
      let f = i / w;
      // Convert to log frequency scale (octaves).
      f = nyquist * Math.pow(2.0, noctaves * (f - 1.0));
      frequencyHz[i] = f;
    }

    filterNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);

    // draw
    context.strokeStyle = filter ? color : theme.colors.gray[400];
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, 0);

    for (let i = 0; i < w; ++i) {
      const f = magResponse[i];
      const response = magResponse[i];
      const dbResponse = 20.0 * Math.log(response) / Math.LN10;
      const x = i;
      const y = (0.5 * h) - pixelsPerDb * dbResponse;

      if (i == 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  };

  useEffect(() => {
    if (!audioCtx || !filter1Node || !filter2Node) { return; }
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.oncontextmenu = function () { return false; };
      const context = canvas.getContext('2d');
      if (context) {
        const w = canvas.width;
        const h = canvas.height;
        const nyquist = 0.5 * audioCtx.sampleRate;

        context.clearRect(0, 0, w, h);

        filter1Node.type = filter1Type;
        filter1Node.frequency.value = filter1Freq;
        filter1Node.Q.value = filter1Q;
        filter1Node.gain.value = filter1Gain;

        filter2Node.type = filter2Type;
        filter2Node.frequency.value = filter2Freq;
        filter2Node.Q.value = filter2Q;
        filter2Node.gain.value = filter2Gain;

        drawFilterCurve(context, w, h, nyquist, filter1Node, filter1, theme.colors.brand[500]);
        drawFilterCurve(context, w, h, nyquist, filter2Node, filter2, theme.colors.brand[400]);

      }
    }
  }, [
    audioCtx,
    filter1Node, filter1, filter1Type, filter1Freq, filter1Q, filter1Gain,
    filter2Node, filter2, filter2Type, filter2Freq, filter2Q, filter2Gain,
  ]);

  return <canvas width="256px" height="100px" ref={canvasRef} style={{ "background": theme.colors.brand[900] }} />;
  // return <canvas width="300px" height="120px" ref={canvasRef} style={{ "background": theme.colors.brand[900] }} />
};
