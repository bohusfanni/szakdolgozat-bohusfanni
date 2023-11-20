import React, {useState} from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import SignInInput from '../../components/SignInInput';
import SignInButton from '../../components/SignInButton';
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth';
import firebase from 'firebase/app';
import { FIREBASE_APP, FIREBASE_AUTH} from '../../config/firebase';
import LandingPage from '../LandingPage';
import SignUp from '../SignUp';
import NavigationContainer from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const SignIn = () =>  {
    //const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = FIREBASE_AUTH

    const {height} = useWindowDimensions();

    const navigation = useNavigation();

    const Stack = createStackNavigator();

    

    const onSignInPressed = async (e) => {
        e.preventDefault();
        try {
            console.log(email, password)
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            navigation.navigate(LandingPage);
        } catch (error) {
            if(error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            } else if (error.code === 'auth/wrong-password') {
                console.log('Wrong password!');
            }
        }
    };

    const onForgotPasswordPressed = () => {
        console.warn("forgot password");
    }
    const onSignInGoogle = () => {
        console.warn("google sign in");
    }
    const onSignUpPressed = () => {
        navigation.navigate(SignUp);
        console.warn("registration clicked");
    }
    
    return (
        <View style={style.root}>
            <Image
                source={Logo} 
                style={[style.logo, {height: height * 0.3}]} 
                resizeMode="contain"
            />

            <SignInInput 
                placeholder="Email cím"
                value={email} 
                setValue={setEmail}
                required
            />
            <SignInInput
                placeholder="Jelszó" 
                value={password} 
                setValue={setPassword}
                secureTextEntry
                required
            />
            <SignInButton
                title="Bejelentkezés"
                onPress={onSignInPressed}
            />
            <SignInButton
                title="Elfelejtettem a jelszavam"
                onPress={onForgotPasswordPressed}
            />
            <SignInButton
                title={"Bejelentkezés Google fiókkal"}
                onPress={onSignInGoogle}
            />
            <SignInButton
                title={"Regisztrálni szeretnék"}
                onPress={onSignUpPressed}
            />
        </View>
    );
};

const style = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 50,
    },
    logo: {
        width: "70%",
        maxWidth: 300,
        maxHeight: 200,
    },
});

export default SignIn;