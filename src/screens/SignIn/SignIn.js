import React, { useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
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
    } catch (e) {
      setError(e.message ?? 'Sikertelen bejelentkezés');
    } finally {
      setSubmitting(false);
    }
  };

  const goToSignUp = () => nav.navigate('SignUp');

  return (
    <View style={styles.root}>
      <View style={styles.logoWrapper}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <Text style={styles.title}>Bejelentkezés</Text>

      <View style={styles.form}>
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

        <SignInButton
          title={submitting ? 'Bejelentkezés...' : 'Belépés'}
          onPress={onSignIn}
          disabled={submitting}
        />

        <SignInButton
          variant="link"
          title="Nincs fiókod? Regisztráció"
          onPress={goToSignUp}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  form: {
    width: '100%',
    gap: 12,
  },
  error: {
    color: 'crimson',
    marginTop: 4,
    marginBottom: 4,
  },
});

export default SignIn;
