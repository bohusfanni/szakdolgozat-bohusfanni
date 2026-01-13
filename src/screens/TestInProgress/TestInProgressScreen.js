import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { getToneWavUri } from "../../utils/toneWav";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FREQS = [125, 250, 500, 1000, 2000, 4000, 8000];

const START_LEVEL = 40;
const MIN_LEVEL = 0;
const MAX_LEVEL = 120;

const STEP_BIG = 10;
const STEP_SMALL = 5;
const REVERSALS_TO_FINISH = 4;
const MAX_TRIALS_PER_FREQ = 12;

const randDelayMs = () => 600 + Math.floor(Math.random() * 900); 
const randPostToneDelayMs = () => 600 + Math.floor(Math.random() * 900);


function clamp(x, a, b) {
  return Math.min(b, Math.max(a, x));
}

export default function TestInProgressScreen({ route, navigation }) {
  const { ear, note } = route.params;

  const [freqIndex, setFreqIndex] = useState(0);
  const [level, setLevel] = useState(START_LEVEL);

  const [phase, setPhase] = useState("waiting"); 
  const [trialNo, setTrialNo] = useState(0);

  const thresholdsRef = useRef(new Array(FREQS.length).fill(null));

  const lastDirectionRef = useRef(null); 
  const reversalsRef = useRef(0);
  const reversalLevelsRef = useRef([]); 
  const stepRef = useRef(STEP_BIG);

  const trialsThisFreqRef = useRef(0);

  const soundRef = useRef(null);
  const timerRef = useRef(null);
  const startedRef = useRef(false);

  const freqHz = FREQS[freqIndex];
  const progressText = useMemo(
    () => `${freqIndex + 1}/${FREQS.length}`,
    [freqIndex]
  );

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      shouldDuckAndroid: true,
    }).catch((e) => console.warn("Audio mode error:", e));
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const playTone = async (toneFreqHz, levelDbHL) => {
  try {
    const stored = await AsyncStorage.getItem("CALIBRATION_FACTOR");
    const calibration = stored ? JSON.parse(stored) : { factor: 1 };

    const volume = Math.max(
      0.05,
      Math.min(1, (levelDbHL / 80) * (calibration.factor ?? 1))
    );

    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const uri = await getToneWavUri({ freqHz: toneFreqHz, durationMs: 700 });

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false, volume }
    );

    soundRef.current = sound;

    await new Promise(async (resolve, reject) => {
      let resolved = false;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status?.isLoaded) return;

        if (status.didJustFinish && !resolved) {
          resolved = true;
          sound.setOnPlaybackStatusUpdate(null);
          resolve();
        }
      });

      try {
        await sound.playAsync();
      } catch (e) {
        if (!resolved) {
          resolved = true;
          sound.setOnPlaybackStatusUpdate(null);
          reject(e);
        }
      }
    });
  } catch (e) {
    console.warn("playTone failed:", e);
  }
};



  const scheduleNextPrompt = () => {
    setPhase("waiting");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const preDelay = randDelayMs();
    const postDelay = randPostToneDelayMs(); 

    timerRef.current = setTimeout(async () => {
      await playTone(freqHz, level);

      await new Promise((res) => setTimeout(res, postDelay));

      setPhase("prompt");
      setTrialNo((t) => t + 1);
    }, preDelay);
  };



  const resetForNextFrequency = () => {
    trialsThisFreqRef.current = 0;
    setTrialNo(0);

    lastDirectionRef.current = null;
    reversalsRef.current = 0;
    reversalLevelsRef.current = [];
    stepRef.current = STEP_BIG;

    setLevel(START_LEVEL);
    scheduleNextPrompt();
  };

  const finishFrequency = () => {
    const revs = reversalLevelsRef.current;
    let th = level;

    if (revs.length >= 2) {
      const last2 = revs.slice(-2);
      th = Math.round((last2[0] + last2[1]) / 2);
    } else if (revs.length === 1) {
      th = Math.round(revs[0]);
    }

    thresholdsRef.current[freqIndex] = clamp(th, MIN_LEVEL, MAX_LEVEL);

    if (freqIndex < FREQS.length - 1) {
      setFreqIndex((i) => i + 1);
      resetForNextFrequency();
    } else {
      setPhase("waiting");
      navigation.replace("TestResult", {
        ear,
        note,
        freqsHz: FREQS,
        thresholdsDbHL: thresholdsRef.current.map((x) => (x ?? START_LEVEL)),
        method: "adaptive-audio",
      });
    }
  };

  const handleAnswer = (answer) => {
    trialsThisFreqRef.current += 1;

    if (trialsThisFreqRef.current >= MAX_TRIALS_PER_FREQ) {
      setPhase("waiting");
      finishFrequency();
      return;
    }

    const direction = answer === "heard" ? "down" : "up";
    const step = stepRef.current;

    const lastDir = lastDirectionRef.current;
    if (lastDir && lastDir !== direction) {
      reversalsRef.current += 1;
      reversalLevelsRef.current.push(level);

      if (stepRef.current === STEP_BIG) stepRef.current = STEP_SMALL;
    }

    lastDirectionRef.current = direction;

    const nextLevel = direction === "down" ? level - step : level + step;
    const clamped = clamp(nextLevel, MIN_LEVEL, MAX_LEVEL);
   if (answer === "heard" && level <= MIN_LEVEL) {
      thresholdsRef.current[freqIndex] = MIN_LEVEL;
      setPhase("waiting");
      finishFrequency();
      return;
    }
    if (answer === "not" && level >= MAX_LEVEL) {
      thresholdsRef.current[freqIndex] = MAX_LEVEL;
      setPhase("waiting");
      finishFrequency();
      return;
    }

    setLevel(clamped);

    if (reversalsRef.current >= REVERSALS_TO_FINISH) {
      setPhase("waiting");
      finishFrequency();
      return;
    }

    scheduleNextPrompt();
  };

  if (!startedRef.current) {
    startedRef.current = true;
    scheduleNextPrompt();
  }

  const cancelTest = () => {
    Alert.alert(
      "Megszakítás",
      "Biztosan megszakítod a tesztet?",
      [
        { text: "Mégse", style: "cancel" },
        { text: "Igen", style: "destructive", onPress: () => navigation.goBack() },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={cancelTest}
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.actionBtnText}>Megszakítás</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Teszt</Text>

        <View style={{ width: 110 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.line}>Fül: {ear}</Text>
        <Text style={styles.line}>
          Frekvencia: {freqHz} Hz ({progressText})
        </Text>
        <Text style={styles.line}>Próba: {trialNo}</Text>
        <Text style={styles.line}>Szint: {level} dBHL</Text>
        <Text style={styles.line}>
          Reversal: {reversalsRef.current}/{REVERSALS_TO_FINISH} (lépés: {stepRef.current})
        </Text>
        <Text style={styles.line}>
          Próbák ezen a frekin: {trialsThisFreqRef.current}/{MAX_TRIALS_PER_FREQ}
        </Text>

        <View style={{ height: 14 }} />

        {phase === "waiting" ? (
          <Text style={styles.waitingText}>Várakozás…</Text>
        ) : (
          <>
            <Text style={styles.promptText}>Hallottad a hangot?</Text>

            <View style={styles.btnRow}>
              <Pressable
                onPress={() => handleAnswer("heard")}
                style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.primaryBtnText}>Hallottam</Text>
              </Pressable>

              <Pressable
                onPress={() => handleAnswer("not")}
                style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.secondaryBtnText}>Nem hallottam</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
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

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
  },
  line: { fontSize: 14, marginTop: 4 },

  waitingText: { fontSize: 16, fontWeight: "700", color: "#444" },
  promptText: { fontSize: 16, fontWeight: "800", marginBottom: 10 },

  btnRow: { flexDirection: "row", gap: 10 },
  primaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
  },
  primaryBtnText: { fontWeight: "900" },

  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  secondaryBtnText: { fontWeight: "900" },
});
