import { useState, useEffect, useRef } from 'react';
import { theme } from '@/libs/theme';
import { clamp, radian } from '@/libs/utils';

interface Props {
  value: number;
  onChange: (frequency: number) => void;
  min: number;
  max: number;
  size?: number;
  circleFillColor?: string;
  circleEmptyColor?: string;
  barColor?: string;
  isDisabled?: boolean;
}

export const FrequencyKnob = ({
  value,
  onChange,
  min,
  max,
  size,
  circleFillColor,
  circleEmptyColor,
  barColor,
  isDisabled,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [mouseDownFlag, setMouseDownFlag] = useState(false);
  // const [mouseOffsetY, setMouseOffsetY] = useState(0);

  var mouseDownFlag = false;
  var my = 0;
  var mouseOffsetY = 0;

  // memo
  // y = nyquist * 2.0 ** (11 * (x - 1) // noctaves
  // x = log2(y / nyquist) / 11 + 1

  const percentToFrequency = (value: number): number => {
    const nyquist = 20050; // context.sampleRate * 0.5;
    const noctaves = Math.log(nyquist / 10.0) / Math.LN2;
    const v2 = Math.pow(2.0, noctaves * (clamp(value) - 1.0));
    return Math.round(v2 * nyquist);
  }

  const frequencyToPercent = (frequency: number): number => {
    const nyquist = 20050; // context.sampleRate * 0.5;
    const noctaves = Math.log(nyquist / 10.0) / Math.LN2;
    const percent = clamp(Math.log2(frequency / nyquist) / noctaves + 1);
    return Math.round(percent * 100) / 100;
  }

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // TODO: やっぱり useState を使った方がいい
    // マウスが動くたびにロードされる
    // console.log("load knob");

    window.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      my = event.clientY - rect.top;

      if (mouseDownFlag) {
        const percent = frequencyToPercent(value);
        const mousePercent = (mouseOffsetY - my) / 200;
        onChange(clamp(percentToFrequency(percent + mousePercent), min, max));
        // setValue(clamp(value + Math.floor((mouseOffsetY - my) / 2), min, max))
        // console.log(my - mouseOffsetY);
      }
    })

    canvas.addEventListener('mousedown', () => {
      if (!mouseDownFlag) {
        document.body.classList.add("noselect");
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mouseOffsetY = my;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mouseDownFlag = true;
      }
    })

    window.addEventListener('mouseup', () => {
      mouseDownFlag = false;
      document.body.classList.remove("noselect");
    })
  })

  useEffect(() => {
    const _size = (size || 40);

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.oncontextmenu = function () {return false;}
      const context = canvas.getContext('2d');
      if (context) {
          const w = canvas.width;
          const h = canvas.height;
          const r = w / 2;
          const lineW = _size / 10;
          const percent = frequencyToPercent(value);

          context.clearRect(0, 0, w, h);

          // circle
          if (isDisabled) {
            context.fillStyle = theme.colors.gray[400];
          } else {
            context.fillStyle = circleFillColor || theme.colors.brand[500];
          }

          context.beginPath();
          context.moveTo(r, r);
          context.arc(r, r, r, radian(90), radian(90 + percent * 270), false);
          context.arc(r, r, r - lineW, radian(90 + percent * 270), radian(90), true);
          context.fill();

          // circle
          if (percent + 0.05 < 1) {
            context.fillStyle = circleEmptyColor || theme.colors.brand[900];
            context.beginPath();
            context.moveTo(r, r);
            context.arc(r, r, r, radian(90 + (percent + 0.05) * 270), radian(0), false);
            context.arc(r, r, r - lineW, radian(0), radian(90 + (percent + 0.05) * 270), true);
            context.fill();
          }

          // bar
          context.lineWidth = _size / 20;
          context.strokeStyle = barColor || theme.colors.brand[900];
          context.beginPath();
          context.moveTo(r, r);
          context.lineTo(r * Math.cos(radian(90 + percent * 270)) + r, r * Math.sin(radian(90 + percent * 270)) + r);
          context.stroke();
      }
    }
  }, [value, barColor, circleEmptyColor, circleFillColor, isDisabled, max, min, size])

  return <canvas
          width={String(size || 40) + "px"}
          height={String(size || 40) + "px"}
          ref={canvasRef}
          style={{"cursor": "pointer"}}
         />
}
