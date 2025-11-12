import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import SignOutButton from '../../components/SignOutButton';
import SavedFilesPage from '../SavedFilesPage';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {

    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <Logo width={200} height={200} />
            <Button title="Mentett fájlok"
                    onPress={navigation.navigate(SavedFilesPage)}></Button>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.subtitle}>You have successfully signed in.</Text>
            <Text style={styles.subtitle}>This is your landing page.</Text>
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

export default LandingPage;
