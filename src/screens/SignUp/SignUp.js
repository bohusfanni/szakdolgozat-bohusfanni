import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import SignInInput from '../../components/SignInInput';
import SignInButton from '../../components/SignInButton';
import firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from '../LandingPage';
import SignIn from '../SignIn';


const SignUp = () =>  {
    //const [username, setUsername] = useState('');
    const [email, setEmail]    = useState('')
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const auth = getAuth();

    const navigation = useNavigation();

    const {height} = useWindowDimensions();

    const Stack = createStackNavigator();
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            console.log(email, password)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            navigation.navigate(SignIn);
        } catch (error) {
            console.log(error);
        }

    };

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