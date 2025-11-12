import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import SignOutButton from '../../components/SignOutButton';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign-out failed:', e);
    }
  };

  const goToSavedFiles = () => {
    navigation.navigate('SavedFilesPage');
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={{ width: 200, height: 200, marginBottom: 24 }} />

      <Button title="Mentett fájlok" onPress={goToSavedFiles} />

      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>You have successfully signed in.</Text>
      <Text style={styles.subtitle}>This is your landing page.</Text>

      <SignOutButton title="Kijelentkezés" onPress={handleSignOut} />
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
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default LandingPage;
