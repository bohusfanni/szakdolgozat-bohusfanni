import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Pressable } from "react-native";
import { doc, onSnapshot, deleteDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { exportMeasurementCsv } from "../../utils/exportMeasurementCsv"; 
import { SafeAreaView } from "react-native-safe-area-context";


const formatDate = (ms) => {
  if (!ms) return "Dátum nélkül";
  return new Date(ms).toLocaleString();
};

export default function MeasurementDetailScreen({ route, navigation }) {
  const { measurementId } = route.params;

  const [loading, setLoading] = useState(true);
  const [measurement, setMeasurement] = useState(null);

  useEffect(() => {
    const ref = doc(db, "measurements", measurementId);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setMeasurement(null);
          setLoading(false);
          return;
        }
        setMeasurement({ id: snap.id, ...snap.data() });
        setLoading(false);
      },
      (err) => {
        console.warn("MeasurementDetail listen error:", err);
        setLoading(false);
      }
    );

    return unsub;
  }, [measurementId]);

  const confirmDelete = () => {
    Alert.alert(
      "Törlés",
      "Biztosan törlöd ezt a mérést?",
      [
        { text: "Mégse", style: "cancel" },
        {
          text: "Törlés",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "measurements", measurementId));
              navigation.goBack();
            } catch (e) {
              console.warn("Delete failed:", e);
              Alert.alert("Hiba", "Nem sikerült törölni a mérést.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getPoints = () => {
    if (Array.isArray(measurement?.results?.points)) return measurement.results.points;

    if (Array.isArray(measurement?.freqsHz) && Array.isArray(measurement?.thresholdsDbHL)) {
      return measurement.freqsHz.map((f, i) => ({
        freqHz: f,
        thresholdDbHL: measurement.thresholdsDbHL[i],
      }));
    }
    return [];
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Betöltés…</Text>
      </View>
    );
  }

  if (!measurement) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Ez a mérés már nem elérhető.</Text>
      </View>
    );
  }

  const points = getPoints();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Mérés részletei</Text>
      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
        >
        <Text style={styles.backBtnText}>Vissza</Text>
      </Pressable>
      <View style={styles.metaCard}>
        <Text style={styles.metaLine}>Dátum: {formatDate(measurement.createdAt)}</Text>
        <Text style={styles.metaLine}>Fül: {measurement.ear ?? "-"}</Text>
        {measurement.note ? <Text style={styles.metaLine}>Megjegyzés: {measurement.note}</Text> : null}
        <Text style={styles.metaLine}>Pontok: {points.length ? `${points.length} db` : "-"}</Text>
      </View>

      <Text style={styles.sectionTitle}>Eredmények</Text>

      {points.length === 0 ? (
        <Text style={styles.muted}>Nincs elmentett pont ebben a mérésben.</Text>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1 }]}>Frekvencia (Hz)</Text>
            <Text style={[styles.th, { flex: 1 }]}>Küszöb (dBHL)</Text>
          </View>

          {points.map((p, idx) => (
            <View key={`${p.freqHz}-${idx}`} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 1 }]}>{p.freqHz}</Text>
              <Text style={[styles.td, { flex: 1 }]}>{p.thresholdDbHL}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}
          onPress={async () => {
            try {
              await exportMeasurementCsv(measurement);
            } catch (e) {
              console.warn("CSV export failed:", e);
              Alert.alert("Hiba", "Nem sikerült exportálni a CSV-t.");
            }
          }}
        >
          <Text style={styles.btnText}>Export CSV</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btnDanger, pressed && { opacity: 0.7 }]}
          onPress={confirmDelete}
        >
          <Text style={styles.btnDangerText}>Törlés</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  muted: { marginTop: 8, fontSize: 16, color: "#555", textAlign: "center" },

  title: { fontSize: 22, fontWeight: "800", marginBottom: 12 },
  sectionTitle: { marginTop: 12, marginBottom: 8, fontSize: 16, fontWeight: "700" },

  metaCard: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 },
  metaLine: { fontSize: 14, marginTop: 2 },

  table: { borderWidth: 1, borderColor: "#ddd", borderRadius: 12, overflow: "hidden" },
  tableHeader: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: "#ddd" },
  tableRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderColor: "#eee" },
  th: { fontWeight: "700" },
  td: { fontSize: 14 },

  actionsRow: { marginTop: 14, flexDirection: "row", gap: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: "center" },
  btnText: { fontWeight: "700" },
  btnDanger: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#cc0000", alignItems: "center" },
  btnDangerText: { fontWeight: "700", color: "#cc0000" },
  backBtn: {alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", marginBottom: 10 },
  backBtnText: {fontWeight: "700" },
});
