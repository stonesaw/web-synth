import { useEffect, useRef, useState } from 'react';
import { theme } from '@/libs/theme';
import { ATTACK_MAX_MS, ATTACK_MIN_MS } from '@/providers/synth'

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

export const ADSRCanvas = ({
  attack,
  setAttack,
  decay,
  setDecay,
  sustain,
  setSustain,
  release,
  setRelease
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragFlag, setDragFlag, ] = useState("");

  const px = 10;
  const py = 12;
  const buttonRadius = 7;

  const minmax = (value: number, min = 0, max = 1) => {
    return Math.max(min, Math.min(value, max));
  }

  const toAttackMs = (attackPercentage: number) => {
    return (
      attackPercentage <= 0.5 ?
      ATTACK_MIN_MS + (1000 - ATTACK_MIN_MS) * attackPercentage * 2 :
      1000 + (ATTACK_MAX_MS - 1000) * (attackPercentage - 0.5) * 2
    )
  }

  const toAttackPercentage = (attackMs: number) => {
    return (
      attackMs <= 1000 ?
      (attackMs - ATTACK_MIN_MS) / (1000 - ATTACK_MIN_MS) * 0.5 :
      0.5 + (attackMs - 1000) / (ATTACK_MAX_MS - 1000) / 2
    )
  }

  const updateCanvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, a: number, d: number, s: number, r: number) => {
    const containerW = canvas.width  - px * 2;
    const containerY = canvas.height - py * 2;

    let t0x = px;
    let t0y = py + containerY;
    let t1x = px + containerW * (a / 4.0);
    let t1y = py;
    let t2x = px + containerW * (0.25 + d / 4.0);
    let t2y = py + containerY * (1 - s);
    let t3x = px + containerW * 0.75;
    let t3y = t2y;
    let t4x = px + containerW * (0.75 + r / 4.0);
    let t4y = py + containerY;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // line
    context.lineWidth = 2;
    context.strokeStyle = theme.colors.cyan[400];

    context.beginPath();
    context.moveTo(t0x, t0y);
    context.lineTo(t1x, t1y);
    context.lineTo(t2x, t2y);
    context.lineTo(t3x, t3y);
    context.lineTo(t4x, t4y);
    context.stroke();

    // button
    // attack
    context.fillStyle = theme.colors.brand[400];
    context.beginPath();
    context.arc(t1x, t1y, buttonRadius, 0, Math.PI * 2, true);
    context.fill();

    // decay
    context.beginPath();
    context.arc(t2x, t2y, buttonRadius, 0, Math.PI * 2, true);
    context.fill();

    // release
    context.beginPath();
    context.arc(t4x, t4y, buttonRadius, 0, Math.PI * 2, true);
    context.fill();
  }

  // canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.oncontextmenu = function () {return false;}
      const context = canvas.getContext('2d');
      if (context) {
        const containerW = canvas.width  - px * 2;
        const containerY = canvas.height - py * 2;

        let mx = 0;
        let my = 0;

        // console.log("set ADSR");
        let a = toAttackPercentage(attack); // 0.0 ~ 1.0
        let d = toAttackPercentage(decay); // 0.0 ~ 1.0
        let s = sustain / 100; // 0.0 ~ 1.0
        let r = toAttackPercentage(release); // 0.0 ~ 1.0

        let t0x = px;
        let t0y = py + containerY;
        let t1x = px + containerW * (a / 4.0);
        let t1y = py;
        let t2x = px + containerW * (0.25 + d / 4.0);
        let t2y = py + containerY * (1 - s);
        let t3x = px + containerW * 0.75;
        let t3y = t2y;
        let t4x = px + containerW * (0.75 + r / 4.0);
        let t4y = py + containerY;

        let moveFlag = "";

        window.addEventListener('mousedown', () => {
          // マウスホバーしているか
          if (Math.sqrt((t1x - mx) ** 2 + (t1y - my) ** 2) <= buttonRadius) {
            moveFlag = "a";
            document.body.classList.add("noselect");
          } else if (Math.sqrt((t2x - mx) ** 2 + (t2y - my) ** 2) <= buttonRadius) {
            moveFlag = "d";
            document.body.classList.add("noselect");
          } else if (Math.sqrt((t4x - mx) ** 2 + (t4y - my) ** 2) <= buttonRadius) {
            moveFlag = "r";
            document.body.classList.add("noselect");
          }
        }, false);

        window.addEventListener('mouseup', () => {
          if (moveFlag == "a") {
            const _a = (t1x - px) / (containerW * 0.25);
            setAttack(Math.floor(toAttackMs(_a)));
          } else if (moveFlag == "d") {
            const _d = (t2x - px - containerW * 0.25) / (containerW * 0.25);
            setDecay(Math.floor(toAttackMs(_d)));
            const _s = Math.round(100 - (t2y - py) / containerY * 100);
            setSustain(_s);
          } else if (moveFlag == "r") {
            const _r = (t4x - px - containerW * 0.75) / (containerW * 0.25);
            setRelease(Math.floor(toAttackMs(_r)));
          }

          moveFlag = ""
          document.body.classList.remove("noselect");
        }, false);

        window.addEventListener('mousemove', (event) => {
          const rect = canvas.getBoundingClientRect();
          mx = event.clientX - rect.left;
          my = event.clientY - rect.top;

          t1x = px + containerW * (a / 4.0);
          t2x = px + containerW * (0.25 + d / 4.0);
          t2y = py + containerY * (1 - s);
          t4x = px + containerW * (0.75 + r / 4.0)

          // pointer style
          if (moveFlag != "" ||
            (Math.sqrt((t1x - mx) ** 2 + (t1y - my) ** 2) <= buttonRadius || // is hover
             Math.sqrt((t2x - mx) ** 2 + (t2y - my) ** 2) <= buttonRadius ||
             Math.sqrt((t4x - mx) ** 2 + (t4y - my) ** 2) <= buttonRadius)) {
            canvas.style.cursor = "pointer";
          } else {
            canvas.style.cursor = "auto";
          }

          // move button & line
          if (moveFlag == "a") {
            a = minmax((mx - px) / (containerW * 0.25));
            setAttack(Math.floor(toAttackMs(a)));
          } else if (moveFlag == "d") {
            d = minmax((mx - px - containerW * 0.25) / (containerW * 0.25));
            setDecay(Math.floor(toAttackMs(d)));
            s = minmax(1 - (my - py) / containerY);
            setSustain(Math.round(s * 100));
          } else if (moveFlag == "r") {
            r = minmax((mx - px - containerW * 0.75) / (containerW * 0.25));
            setRelease(Math.floor(toAttackMs(r)));
          }

          updateCanvas(canvas, context, a, d, s, r);
        }, false);

        updateCanvas(canvas, context, a, d, s, r);
      }
    }
  }, [attack, setAttack, decay, setDecay, sustain, setSustain, release, setRelease])

  return (<canvas width="340px" height="160px" ref={canvasRef} />)
}
