<div align="center">

![image](https://user-images.githubusercontent.com/50014309/227780102-d5dbc2aa-d5cf-4f31-b997-5dadb3bb1742.png)

# web-synth

Simple Synthesizer with Web Audio API

[🎶 **Play here!**](https://web-synth-smoky.vercel.app/)


</div>

---


## ⚒ Setup

1. Node.js のインストール
2. yarn のインストール


Node.js / yarn のバージョン
```
$ node -v
v16.15.1

$ yarn -v
1.22.19
```

3. `yarn`
4. `yarn dev`
5. ブラウザで [localhost:3000](localhost:3000) を開く


## 📈 TODO
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
- Audio Worklet ひな形作成
    - https://www.cresco.co.jp/blog/entry/17620/
    - UI は とりあえず、Matrix の右に設置
    - 全体の内容が多くなってきたので、全体のUIの改修を行うかも
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

## 💡 参考
Amp 実装
- https://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-basic/envelope-generator

その他フィルターなど
- https://www.g200kg.com/jp/docs/webaudio/oscillator.html
- https://g200kg.github.io/web-audio-api-ja/#biquadfilternode
- https://webaudioapi.com/samples/frequency-response/
