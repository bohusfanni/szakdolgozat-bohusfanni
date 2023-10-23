import React, {useState} from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import SignInInput from '../../components/SignInInput';
import SignInButton from '../../components/SignInButton';
import 'firebase/app';
//import { auth } from '@react-native-firebase/auth';


const SignUp = () =>  {
    //const [username, setUsername] = useState('');
    const [email, setEmail]    = useState('')
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    //const [passwordRepeat, setPasswordRepeat] = useState('');

    const {height} = useWindowDimensions();

    const onFinishedPressed = () => {
        console.warn("registration clicked");
    }
    
    const handleSignUp = () => {
        auth
        .creatUserWithEmailAndPassword(email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log(user.email);
        })
        .catch(error => error.message);
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={style.root}>
                <Image
                    source={Logo} 
                    style={[style.logo, {height: height * 0.3}]} 
                    resizeMode="contain"
                />
                <Text style={style.title}>Regisztráció</Text>
                <SignInInput 
                    placeholder="Email" 
                    value={email} 
                    setValue={setEmail}
                />
                <SignInInput
                    placeholder="Jelszó" 
                    value={password} 
                    setValue={setPassword}
                    secureTextEntry
                />
                <SignInInput
                    placeholder="Jelszó újra" 
                    value={passwordRepeat} 
                    setValue={setPasswordRepeat}
                    secureTextEntry
                />
                <SignInButton
                    title="Kész"
                    onPress={handleSignUp}
                />
            </View>
        </ScrollView>
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
    title: {
        fontSize: 24,
        padding: 20
    },
});

export default SignUp;