import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import SignOutButton from '../../components/SignOutButton';
import getSavedFiles from '../../config/firebase';

const SavedFilesPage = () => {
    return (
        <View style={styles.container}>
            <SignOutButton onPress={async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign-out failed:', e);
    }
  }}></SignOutButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default SavedFilesPage;
