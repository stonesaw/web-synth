# web-synth

Simple Synthesizer with Web Audio API

## 参考
Amp 実装
- https://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/envelope-generator

その他フィルターなど
- https://www.g200kg.com/jp/docs/webaudio/oscillator.html
- https://g200kg.github.io/web-audio-api-ja/#biquadfilternode
- https://webaudioapi.com/samples/frequency-response/


## TODO
### オシレーター
- matrix
- LFO
- Osc2
- canvas (ADSR) の実装変更 ... eventListener を React Styleに

スマホ・タブレットの対応：Knob, ADSRCanvas

### キーボード
- Keyboard ... キー入力
- オクターブの切り替え
- スケール

### エフェクト
- delay
- ping pong delay
- chorus
- reverb
- distortion
- auto pan
- eq eight
- analyzer
- utility

### シーケンサー
### サンプラー


## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
