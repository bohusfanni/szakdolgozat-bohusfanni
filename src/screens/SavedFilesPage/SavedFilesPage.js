import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, Alert, } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import SignOutButton from '../../components/SignOutButton';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { exportMeasurementCsv } from "../../utils/exportMeasurementCsv";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';



const formatDate = (ms) => {
  if (!ms) return 'Dátum nélkül';
  return new Date(ms).toLocaleString();
};

const SavedFilesPage = () => {
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setMeasurements([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'measurements'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMeasurements(list);
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore error:', err);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  const confirmDelete = (id) => {
    Alert.alert(
      'Törlés',
      'Biztosan törlöd ezt a mérést?',
      [
        { text: 'Mégse', style: 'cancel' },
        {
          text: 'Törlés',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'measurements', id));
            } catch (e) {
              console.warn('Delete failed:', e);
              Alert.alert('Hiba', 'Nem sikerült törölni a mérést.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          {navigation.canGoBack() ? (
            <Pressable
              onPress={() => navigation.goBack()}
              style={({ pressed }) => [
              styles.actionBtn,
              pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={styles.actionBtnText}>← Vissza</Text>
            </Pressable>
        ) : (
          <View />   
        )}

        <SignOutButton
          onPress={async () => {
            try {
              await signOut(auth);
            } catch (e) {
              console.warn("Sign-out failed:", e);
            }
          }}
        />
      </View>

      <Text style={styles.title}>Mentett mérések</Text>
    </View>


      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.muted}>Betöltés…</Text>
        </View>
      ) : measurements.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Még nincs elmentett mérésed.</Text>
          <Text style={styles.mutedSmall}>Később az új mérés után itt fog megjelenni.</Text>
        </View>
      ) : (
        <FlatList
          data={measurements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const pointsCount =
              (item.results?.points && item.results.points.length) ||
              (item.freqsHz && item.freqsHz.length) ||
              0;

            return (
              <Pressable 
                style={styles.card} 
                onPress={() => navigation.navigate("MeasurementDetail", { measurementId: item.id })}
              >
                <Text style={styles.cardTitle}>{item.title ?? formatDate(item.createdAt)}</Text>
                <Text style={styles.cardLine}>Dátum: {formatDate(item.createdAt)}</Text>
                <Text style={styles.cardLine}>Fül: {item.ear ?? '-'}</Text>
                <Text style={styles.cardLine}>Pontok: {pointsCount ? `${pointsCount} db` : '-'}</Text>

                <View style={styles.cardActions}>
                  <Pressable
                    onPress={async () => {
                      try {
                        await exportMeasurementCsv(item);
                      } catch (e) {
                        console.warn("CSV export failed:", e);
                        Alert.alert("Hiba", "Nem sikerült exportálni a CSV-t.");
                      }
                    }}
                    style={({ pressed }) => [
                      { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, marginRight: 8 },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Text style={{ fontWeight: "600" }}>Export CSV</Text>
                  </Pressable>

                  <Pressable onPress={() => confirmDelete(item.id)} style={styles.dangerBtn}>
                    <Text style={styles.dangerText}>Törlés</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8, 
  },

  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  muted: { marginTop: 8, fontSize: 16, color: '#555', textAlign: 'center' },
  mutedSmall: { marginTop: 4, fontSize: 13, color: '#777', textAlign: 'center' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cardLine: { fontSize: 14, marginTop: 2 },
  cardActions: { marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end' },
  dangerBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#cc0000' },
  dangerText: { color: '#cc0000', fontWeight: '600' },
  actionBtn: {alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", marginBottom: 10 },
  actionBtnText: {fontWeight: "700" },

});

export default SavedFilesPage;
