import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import SignInInput from '../../components/SignInInput';
import SignInButton from '../../components/SignInButton';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSignUp = async () => {
    setError('');

    if (password !== password2) {
      setError('A jelszavak nem egyeznek');
      return;
    }

    setSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setError(e.message ?? 'Sikertelen regisztráció');
    } finally {
      setSubmitting(false);
    }
  };

  const goToSignIn = () => nav.navigate('SignIn');

  return (
    <View style={styles.root}>
      <View style={styles.logoWrapper}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <Text style={styles.title}>Regisztráció</Text>

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

        <SignInInput
          placeholder="Jelszó ismét"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <SignInButton
          title={submitting ? 'Regisztrálás...' : 'Regisztráció'}
          onPress={onSignUp}
          disabled={submitting}
        />

        <SignInButton
          variant="link"
          title="Már van fiókod? Jelentkezz be"
          onPress={goToSignIn}
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

export default SignUp;
