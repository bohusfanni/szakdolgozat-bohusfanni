import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FREQS = [125, 250, 500, 1000, 2000, 4000, 8000];

function generateDummyThresholds() {
  const base = 10 + Math.floor(Math.random() * 6);
  return FREQS.map((_, i) => base + i * 2 + Math.floor(Math.random() * 5));
}

export default function TestInProgressScreen({ route, navigation }) {
  const { ear, note } = route.params;

  const [progress, setProgress] = useState(0);

  const totalSteps = useMemo(() => FREQS.length, []);

  useEffect(() => {
    let cancelled = false;
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setProgress(i);

      if (i >= totalSteps) {
        const thresholdsDbHL = generateDummyThresholds();
        navigation.replace("TestResult", {
          ear,
          note,
          freqsHz: FREQS,
          thresholdsDbHL,
          method: "dummy",
        });
        return;
      }

      const delay = 600 + Math.floor(Math.random() * 700); 
      setTimeout(tick, delay);
    };

    const firstDelay = 500;
    const t = setTimeout(tick, firstDelay);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [ear, note, navigation, totalSteps]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.actionBtnText}>← Megszakítás</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Teszt fut…</Text>

        <View style={{ width: 110 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.line}>Fül: {ear}</Text>
        <Text style={styles.line}>Állapot: mérés folyamatban</Text>
        <Text style={styles.line}>
          Haladás: {Math.min(progress, totalSteps)}/{totalSteps}
        </Text>

        <View style={styles.progressBarOuter}>
          <View style={[styles.progressBarInner, { width: `${(progress / totalSteps) * 100}%` }]} />
        </View>

        <Text style={styles.hint}>
          (Most dummy. Később itt megy a hang + random szünet + adaptív hangerő.)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  headerTitle: { fontSize: 20, fontWeight: "800" },

  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 110,
    alignItems: "center",
  },
  actionBtnText: { fontWeight: "700" },

  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 },
  line: { fontSize: 14, marginTop: 4 },
  hint: { marginTop: 10, fontSize: 12, color: "#666" },

  progressBarOuter: { marginTop: 12, height: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", overflow: "hidden" },
  progressBarInner: { height: "100%" },
});
