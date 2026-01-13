import * as FileSystem from "expo-file-system/legacy";
import { Buffer } from "buffer";

const cache = new Map();

export async function getToneWavUri({ freqHz, durationMs = 700, sampleRate = 44100 }) {
  const key = `${freqHz}_${durationMs}_${sampleRate}`;
  if (cache.has(key)) return cache.get(key);

  const numSamples = Math.floor((durationMs / 1000) * sampleRate);
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const fileSize = 44 + dataSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  let offset = 0;
  const writeStr = (s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset++, s.charCodeAt(i));
  };
  const writeU32 = (v) => { view.setUint32(offset, v, true); offset += 4; };
  const writeU16 = (v) => { view.setUint16(offset, v, true); offset += 2; };

  writeStr("RIFF");
  writeU32(fileSize - 8);
  writeStr("WAVE");

  writeStr("fmt ");
  writeU32(16);           
  writeU16(1);             
  writeU16(numChannels);
  writeU32(sampleRate);
  writeU32(byteRate);
  writeU16(blockAlign);
  writeU16(bitsPerSample);

  writeStr("data");
  writeU32(dataSize);

  const amplitude = 0.25; 
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * freqHz * t);
    const s16 = Math.max(-1, Math.min(1, sample)) * 32767 * amplitude;
    view.setInt16(offset, s16, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  const base64 = Buffer.from(bytes).toString("base64");

  const uri = FileSystem.cacheDirectory + `tone_${key}.wav`;
  await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });

  cache.set(key, uri);
  return uri;
}
