import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToneWavUri } from "../../utils/toneWav";

const REF_FREQ = 1000; 
const STORAGE_KEY = "CALIBRATION_FACTOR";

export default function CalibrationScreen({ navigation }) {
  const [volume, setVolume] = useState(0.5);
  const soundRef = useRef(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const playReference = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const uri = await getToneWavUri({ freqHz: REF_FREQ, durationMs: 1000 });
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, volume }
    );

    soundRef.current = sound;
    await sound.playAsync();
  };

  const saveCalibration = async () => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        factor: volume,
        updatedAt: Date.now(),
      })
    );
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kalibráció</Text>

      <Text style={styles.text}>
        Állítsd be a hangerőt addig, amíg a hang éppen hallható.
      </Text>

      <Pressable style={styles.btn} onPress={playReference}>
        <Text style={styles.btnText}>Referencia hang lejátszása</Text>
      </Pressable>

      <Slider
        style={{ width: "100%" }}
        minimumValue={0.05}
        maximumValue={1}
        value={volume}
        onValueChange={setVolume}
      />

      <Text style={styles.value}>Szint: {(volume * 100).toFixed(0)}%</Text>

      <Pressable style={[styles.btn, styles.saveBtn]} onPress={saveCalibration}>
        <Text style={styles.btnText}>Kalibráció mentése</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  text: { marginBottom: 16 },
  btn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111",
    marginVertical: 12,
    alignItems: "center",
  },
  saveBtn: { backgroundColor: "#111" },
  btnText: { fontWeight: "700", color: "#111" },
  value: { marginTop: 8, fontWeight: "700" },
});
