export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const clamp = (value: number, min = 0, max = 1) => {
  return Math.max(min, Math.min(value, max));
};

// degree to radian
export const radian = (degree: number) => {
  return degree * Math.PI / 180;
};

// e.g. "C4" -> 440 (Hz)
export const noteNameToFrequency = (noteName: string): number => {
  const frequency = 440 * Math.pow(2, (noteNameToNoteNumber(noteName) - 60) / 12);
  return Number(frequency.toFixed(4));
};

// ノートナンバー (C4 = 60) を 周波数 (C4 = 440Hz) に変換
// e.g. 60 -> 440
// C-1 は
export const noteNumberToFrequency = (noteNumber: number): number => {
  if (noteNumber < 12 || noteNumber > 127) {
    throw new Error(`undefined note number (${noteNumber})`);
  }
  const frequency = 440 * Math.pow(2, (noteNumber - 60) / 12);
  return Number(frequency.toFixed(4));
};

export const noteNameToNoteNumber = (noteName: string): number => {
  const m = noteName.trim().match(/^([a-g][#b]?)(\d+)$/i);
  if(!m) {
    throw new Error(`undefined note name ${noteName}`);
  }
  const [name, octave] = [capitalizeFirstLetter(m[1]), +m[2]];
  const num = {
    "Cb": -1,
    "C": 0,
    "C#": 1, "Db": 1,
    "D": 2,
    "D#": 3, "Eb": 3,
    "E": 4,
    "F": 5, "E#": 5,
    "F#": 6, "Gb": 6,
    "G": 7,
    "G#": 8, "Ab": 8,
    "A": 9,
    "A#": 10, "Bb": 10,
    "B": 11,
  }[name];
  if (typeof num == "number") {
    return ((octave + 1) * 12 + num);
  } else {
    throw new Error(`undefined note name ${noteName}`);
  }
};

// TODO: # only
// TODO: option # or b flag
export const noteNumberToNoteName = (noteNumber: number): string => {
  if (noteNumber < 12 || noteNumber > 127) {
    throw new Error(`undefined note number (${noteNumber})`);
  }
  const scale = noteNumber % 12;
  const octave = Math.floor(noteNumber / 12) - 1;
  const scales = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  return scales[scale] + String(octave);
};

export const percentToFrequency = (value: number, nyquist = 22050): number => {
  const octaves = Math.log(nyquist / 10.0) / Math.LN2;
  const v2 = Math.pow(2.0, octaves * (clamp(value) - 1.0));
  return Math.round(v2 * nyquist);
};

export const frequencyToPercent = (frequency: number, nyquist = 22050): number => {
  const octaves = Math.log(nyquist / 10.0) / Math.LN2;
  const percent = clamp(Math.log2(frequency / nyquist) / octaves + 1);
  return Math.round(percent * 100) / 100;
};
