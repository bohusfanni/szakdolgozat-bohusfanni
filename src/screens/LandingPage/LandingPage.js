import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import 'firebase/app';
import SignOutButton from '../../components/SignOutButton';

const LandingPage = () => {
    return (
        <View style={styles.container}>
            <Logo width={200} height={200} />
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>You have successfully signed in.</Text>
            <Text style={styles.subtitle}>This is your landing page.</Text>
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

export default LandingPage;
