import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SignInInput from '../../components/SignInInput';
import SignInButton from '../../components/SignInButton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // ha sikerült, az App szintű listener átdob a LandingPage-re
    } catch (e) {
      setError(e.message ?? 'Sikertelen bejelentkezés');
    } finally {
      setSubmitting(false);
    }
  };

  const goToSignUp = () => nav.navigate('SignUp');

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Bejelentkezés</Text>

      <SignInInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <SignInInput
        placeholder="Jelszó"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <SignInButton title={submitting ? 'Bejelentkezés...' : 'Belépés'} onPress={onSignIn} disabled={submitting} />
      <SignInButton variant="link" title="Nincs fiókod? Regisztráció" onPress={goToSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  error: { color: 'crimson' },
});

export default SignIn;
