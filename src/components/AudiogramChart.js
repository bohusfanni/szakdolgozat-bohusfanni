import React, { useMemo, useState } from "react";
import { View } from "react-native";
import Svg, { Line, Text as SvgText, Polyline, Circle, Rect } from "react-native-svg";

export default function AudiogramChart({
  points = [],
  yMin = 0,
  yMax = 120,
  yStep = 20,
  height = 240,
  paddingX = 24,
  paddingTop = 24,
  paddingBottom = 44,
}) {
  const [width, setWidth] = useState(0);

  const freqs = useMemo(() => {
    const list = (points ?? [])
      .map((p) => p.freqHz)
      .filter((v) => typeof v === "number" && !Number.isNaN(v));
    if (!list.length) return [125, 250, 500, 1000, 2000, 4000, 8000];
    return Array.from(new Set(list)).sort((a, b) => a - b);
  }, [points]);

  const left = paddingX;
  const right = paddingX;
  const top = paddingTop;
  const bottom = paddingBottom;

  const plotW = Math.max(0, width - left - right);
  const plotH = Math.max(0, height - top - bottom);

  const xForFreq = (freq) => {
  if (freqs.length === 1) return left + plotW / 2;
  const i = freqs.indexOf(freq);
  const t = i / (freqs.length - 1);
  return left + t * plotW;
  };


  const yForDb = (db) => {
  const clamped = Math.min(yMax, Math.max(yMin, db ?? yMax));
  const t = (clamped - yMin) / (yMax - yMin);
  return top + t * plotH;
  };


  const polyPoints = useMemo(() => {
    const ordered = (points ?? [])
      .filter((p) => typeof p.freqHz === "number" && typeof p.thresholdDbHL === "number")
      .slice()
      .sort((a, b) => a.freqHz - b.freqHz);

    return ordered.map((p) => `${xForFreq(p.freqHz)},${yForDb(p.thresholdDbHL)}`).join(" ");
  }, [points, width, freqs, plotW, plotH]);

  const yTicks = [];
  for (let v = yMin; v <= yMax; v += yStep) yTicks.push(v);

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ width: "100%" }}
    >
      {width > 0 ? (
        <Svg width={width} height={height}>

          <Rect x="0" y="0" width={width} height={height} fill="#fff" />

          <Rect
            x={left}
            y={top}
            width={plotW}
            height={plotH}
            fill="#fff"
            stroke="#ddd"
            strokeWidth="1"
            rx="10"
          />

          {/* Y rács + címkék */}
          {yTicks.map((v) => {
            const y = yForDb(v);
            return (
              <React.Fragment key={`y-${v}`}>
                <Line
                  x1={left}
                  y1={y}
                  x2={left + plotW}
                  y2={y}
                  stroke={v === 0 ? "#bbb" : "#eee"}
                  strokeWidth={1}
                />
                <SvgText
                  x={left - 8}
                  y={y + 4}
                  fontSize="10"
                  fill="#666"
                  textAnchor="end"
                >
                  {v}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* X rács + címkék */}
          {freqs.map((f) => {
            const x = xForFreq(f);
            return (
              <React.Fragment key={`x-${f}`}>
                <Line
                  x1={x}
                  y1={top}
                  x2={x}
                  y2={top + plotH}
                  stroke="#eee"
                  strokeWidth={1}
                />
                <SvgText
                  x={x}
                  y={top + plotH + 16}
                  fontSize="10"
                  fill="#666"
                  textAnchor="middle"
                >
                  {f >= 1000 ? `${f / 1000}k` : `${f}`}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Tengely feliratok */}
          <SvgText
            x={left}
            y={top - 8}
            fontSize="11"
            fill="#444"
            textAnchor="start"
          >
            dBHL (lefelé nő)
          </SvgText>

          <SvgText
            x={left + plotW}
            y={top + plotH + 34}
            fontSize="11"
            fill="#444"
            textAnchor="end"
          >
            Frekvencia (Hz)
          </SvgText>

          {/* Görbe */}
          {polyPoints ? (
            <Polyline
              points={polyPoints}
              fill="none"
              stroke="#111"
              strokeWidth="2"
            />
          ) : null}

          {/* Pontok */}
          {(points ?? [])
            .filter((p) => typeof p.freqHz === "number" && typeof p.thresholdDbHL === "number")
            .map((p, idx) => (
              <Circle
                key={`pt-${p.freqHz}-${idx}`}
                cx={xForFreq(p.freqHz)}
                cy={yForDb(p.thresholdDbHL)}
                r="4"
                fill="#111"
              />
            ))}
        </Svg>
      ) : null}
    </View>
  );
}
