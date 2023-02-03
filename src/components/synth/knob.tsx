import { useState, useEffect, useRef } from 'react';
import { theme } from '@/libs/theme';
import { clamp } from '@/libs/utils';

interface Props {
  value: number,
  setValue: (v: number) => void
  min: number,
  max: number,
}

export const Knob = ({
  value,
  setValue,
  min,
  max
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [mouseDownFlag, setMouseDownFlag] = useState(false);
  // const [mouseOffsetY, setMouseOffsetY] = useState(0);

  const radian = (deg: number) => {
    return deg * Math.PI / 180;
  }

  const hover = (canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      canvas.style.cursor = "pointer";
    }
    return undefined;
  }

  let mouseDownFlag = false;
  let my = 0;
  let mouseOffsetY = 0;

  useEffect(() => {
    console.log("a")
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    window.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      my = event.clientY - rect.top;

      if (mouseDownFlag) {
        // TODO: valueが更新されない
        setValue(clamp(value + Math.floor((mouseOffsetY - my) / 2), min, max))
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
  // }, [canvasRef])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.oncontextmenu = function () {return false;}
      const context = canvas.getContext('2d');
      if (context) {
          const w = canvas.width;
          const h = canvas.height;
          const r = w / 2;
          const lineW = 4;
          const percent = value / max;

          context.clearRect(0, 0, w, h);

          // circle
          context.beginPath();
          context.moveTo(r, r);
          context.fillStyle = theme.colors.brand[500];
          context.arc(r, r, r, radian(90), radian(90 + percent * 270), false);
          context.arc(r, r, r - lineW, radian(90 + percent * 270), radian(90), true);
          context.fill();

          // circle
          if (percent + 0.05 < 1) {
            context.beginPath();
            context.moveTo(r, r);
            context.fillStyle = theme.colors.brand[900];
            context.arc(r, r, r, radian(90 + (percent + 0.05) * 270), radian(0), false);
            context.arc(r, r, r - lineW, radian(0), radian(90 + (percent + 0.05) * 270), true);
            context.fill();
          }

          // bar
          context.lineWidth = 2;
          context.strokeStyle = theme.colors.brand[900];
          context.beginPath();
          context.moveTo(r, r);
          context.lineTo(r * Math.cos(radian(90 + percent * 270)) + r, r * Math.sin(radian(90 + percent * 270)) + r);
          context.stroke();
      }
    }
  })

  return <canvas
          width="40px"
          height="40px"
          ref={canvasRef}
          onMouseOver={hover(canvasRef.current)}
         />
}
