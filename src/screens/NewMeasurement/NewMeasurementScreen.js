import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const FREQS = [125, 250, 500, 1000, 2000, 4000, 8000];

function generateDummyThresholds() {
  const base = 10 + Math.floor(Math.random() * 6); 
  const [ear, setEar] = useState("L"); 
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  const earLabel = useMemo(() => {
    if (ear === "L") return "Bal";
    if (ear === "R") return "Jobb";
    return "Mindkettő";
  }, [ear]);

  const saveDummyMeasurement = async () => {
    if (!user) {
      Alert.alert("Hiba", "Bejelentkezés szükséges.");
      return;
    }

    setSaving(true);
    try {
      const thresholdsDbHL = generateDummyThresholds();

      await addDoc(collection(db, "measurements"), {
        userId: user.uid,
        createdAt: Date.now(),
        ear,
        freqsHz: FREQS,
        thresholdsDbHL,
        note: note.trim() || "",
        method: "dummy",
      });

      Alert.alert("Siker", "Mérés elmentve.");
      navigation.goBack(); 
    } catch (e) {
      console.warn("Save measurement failed:", e);
      Alert.alert("Hiba", "Nem sikerült elmenteni a mérést.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.actionBtnText}>← Vissza</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Új mérés</Text>

        <View style={{ width: 90 }} />
      </View>

      <Text style={styles.label}>Fül kiválasztása</Text>
      <View style={styles.segmentRow}>
        <SegmentBtn active={ear === "L"} onPress={() => setEar("L")} text="Bal" />
        <SegmentBtn active={ear === "R"} onPress={() => setEar("R")} text="Jobb" />
        <SegmentBtn active={ear === "both"} onPress={() => setEar("both")} text="Mindkettő" />
      </View>
      <Text style={styles.muted}>Kiválasztva: {earLabel}</Text>

      <Text style={[styles.label, { marginTop: 14 }]}>Megjegyzés (opcionális)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="pl. megfázás, zajos környezet..."
        style={styles.input}
        multiline
      />

      <View style={{ height: 16 }} />

      <Pressable
        disabled={saving}
        onPress={() => navigation.navigate("TestInProgress", { ear, note })}
        style={({ pressed }) => [
          styles.primaryBtn,
          saving && { opacity: 0.6 },
          pressed && !saving && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.primaryBtnText}>
          {saving ? "Mentés..." : "Teszt indítása"}
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        Ez most még csak dummy adat. Később itt indul majd az audiometria (hangok, random szünet, adaptív hangerő).
      </Text>
    </SafeAreaView>
  );
}

function SegmentBtn({ active, onPress, text }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.segmentBtn,
        active && styles.segmentBtnActive,
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  header: {
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
    minWidth: 90,
    alignItems: "center",
  },
  actionBtnText: { fontWeight: "700" },

  label: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  muted: { marginTop: 8, color: "#555" },

  segmentRow: { flexDirection: "row", gap: 8 },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  segmentBtnActive: { borderColor: "#111" },
  segmentText: { fontWeight: "700", color: "#444" },
  segmentTextActive: { color: "#111" },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
  },

  primaryBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#111",
    alignItems: "center",
  },
  primaryBtnText: { fontWeight: "800" },

  hint: { marginTop: 12, fontSize: 12, color: "#666" },
});
