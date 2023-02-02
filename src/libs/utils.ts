export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ノートナンバー (C4 = 60) を 周波数 (C4 = 440Hz) に変換
export const noteNameToFrequency = (noteName: string): number => {
  const m = noteName.trim().match(/^([a-g][#b]?)(\d+)$/i);
  if(!m) return 0;
  const [name, octave] = [m[1].toUpperCase(), +m[2]];
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
  // const num = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(name);
  if (typeof num == "number") {
    const freq = 440 * Math.pow(2, (octave * 12 + num - 57) / 12);
    return Number(freq.toFixed(4));
  } else {
    return 0;
  }
}

// e.g. "C4", "c4" = 60
// e.g. "c3" = 48
// export const noteNameToNumber = (noteName: string): number => {
// }
