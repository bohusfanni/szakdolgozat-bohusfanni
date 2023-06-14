import React, {useState} from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import SignInInput from '../../components/SignInInput';
import SignInButton from '../../components/SignInButton';

const SignIn = () =>  {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {height} = useWindowDimensions();

    const onSignInPressed = () => {
        console.warn("sign in");
    }

    const onForgotPasswordPressed = () => {
        console.warn("forgot password");
    }
    const onSignInGoogle = () => {
        console.warn("google sign in");
    }
    const onSignUpPressed = () => {
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
                placeholder="Felhasználónév" 
                value={username} 
                setValue={setUsername}
            />
            <SignInInput
                placeholder="Jelszó" 
                value={password} 
                setValue={setPassword}
                secureTextEntry
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