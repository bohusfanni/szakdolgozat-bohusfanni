import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import AudiogramChart from "../../components/AudiogramChart";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TestResultScreen({ route, navigation }) {
  const { ear, note, freqsHz, thresholdsDbHL, method } = route.params;

  const [saving, setSaving] = useState(false);

  const points = useMemo(() => {
    return (freqsHz ?? []).map((f, i) => ({
      freqHz: f,
      thresholdDbHL: thresholdsDbHL?.[i],
    }));
  }, [freqsHz, thresholdsDbHL]);

  const saveMeasurement = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Hiba", "Bejelentkezés szükséges.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "measurements"), {
        userId: user.uid,
        createdAt: Date.now(),
        ear,
        note: note?.trim() || "",
        method: method ?? "dummy",
        freqsHz,
        thresholdsDbHL,
      });

      Alert.alert("Siker", "Mérés elmentve.");
      navigation.popToTop();
    } catch (e) {
      console.warn("Save failed:", e);
      Alert.alert("Hiba", "Nem sikerült menteni.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.actionBtnText}>← Vissza</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Eredmény</Text>

        <View style={{ width: 90 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={styles.metaCard}>
          <Text style={styles.metaLine}>Fül: {ear}</Text>
          {note ? <Text style={styles.metaLine}>Megjegyzés: {note}</Text> : null}
        </View>

        <Text style={styles.sectionTitle}>Audiogram</Text>
        <View style={styles.chartCard}>
          <AudiogramChart points={points} height={200} />
        </View>

        <Text style={styles.sectionTitle}>Táblázat</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1 }]}>Frekvencia (Hz)</Text>
            <Text style={[styles.th, { flex: 1 }]}>Küszöb (dBHL)</Text>
          </View>
          {points.map((p) => (
            <View key={p.freqHz} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 1 }]}>{p.freqHz}</Text>
              <Text style={[styles.td, { flex: 1 }]}>{p.thresholdDbHL}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 14 }} />

        <Pressable
          disabled={saving}
          onPress={saveMeasurement}
          style={({ pressed }) => [
            styles.primaryBtn,
            saving && { opacity: 0.6 },
            pressed && !saving && { opacity: 0.8 },
          ]}
        >
          <Text style={styles.primaryBtnText}>{saving ? "Mentés..." : "Mérés mentése"}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  headerTitle: { fontSize: 20, fontWeight: "800" },

  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", minWidth: 90, alignItems: "center" },
  actionBtnText: { fontWeight: "700" },

  metaCard: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 },
  metaLine: { fontSize: 14, marginTop: 2 },

  sectionTitle: { marginTop: 12, marginBottom: 8, fontSize: 16, fontWeight: "800" },
  chartCard: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 10 },

  table: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, overflow: "hidden" },
  tableHeader: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: "#ddd" },
  tableRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: "#eee" },
  th: { fontWeight: "800" },
  td: { fontSize: 14 },

  primaryBtn: { paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#111", alignItems: "center" },
  primaryBtnText: { fontWeight: "900" },
});
