import React, {useState} from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import CustomInput from '../../components/SignInInput';
import CustomButton from '../../components/SignInButton';

const SignIn = () =>  {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {height} = useWindowDimensions();
    
    return (
        <View style={style.root}>
            <Image
                source={Logo} 
                style={[style.logo, {height: height * 0.3}]} 
                resizeMode="contain"
            />

            <CustomInput 
                placeholder="Felhasználónév" 
                value={username} 
                setValue={setUsername}
            />
            <CustomInput
                placeholder="Jelszó" 
                value={password} 
                setValue={setPassword}
                secureTextEntry
            />
            <CustomButton
                title="Bejelentkezés"

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