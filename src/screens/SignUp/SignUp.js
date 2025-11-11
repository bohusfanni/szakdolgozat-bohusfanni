import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import SignInInput from '../../components/SignInInput';
import SignInButton from '../../components/SignInButton';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSignUp = async () => {
    setError('');
    setSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // siker után az App listener kezel
    } catch (e) {
      setError(e.message ?? 'Sikertelen regisztráció');
    } finally {
      setSubmitting(false);
    }
  };

  const goToSignIn = () => nav.navigate('SignIn');

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Regisztráció</Text>

      <SignInInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <SignInInput placeholder="Jelszó (min. 6 karakter)" value={password} onChangeText={setPassword} secureTextEntry />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <SignInButton title={submitting ? 'Regisztráció...' : 'Fiók létrehozása'} onPress={onSignUp} disabled={submitting} />
      <SignInButton variant="link" title="Van már fiókod? Bejelentkezés" onPress={goToSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { padding: 24, gap: 12 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  error: { color: 'crimson' },
});

export default SignUp;
