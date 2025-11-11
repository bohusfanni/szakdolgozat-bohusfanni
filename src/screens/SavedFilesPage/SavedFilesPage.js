import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import 'firebase/app';
import SignOutButton from '../../components/SignOutButton';
import getSavedFiles from '../../config/firebase';

const SavedFilesPage = () => {
    return (
        <View style={styles.container}>
            <Logo width={200} height={200} />
            <SignOutButton title="Kijelentkezés"
                           onPress={() => firebase.auth().signOut()}></SignOutButton>
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
