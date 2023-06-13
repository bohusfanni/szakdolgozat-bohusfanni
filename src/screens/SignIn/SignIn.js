import React from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../../../assets/images/logo.jpg';
import CustomInput from '../../components/CustomInput';

const SignIn = () =>  {
    const {height} = useWindowDimensions();
    
    return (
        <View style={styles.root}>
            <Image
                source={Logo} 
                style={[styles.logo, {height: height * 0.3}]} 
                resizeMode="contain"
            />

            <CustomInput/>
        </View>
    );
};

const style = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 100,
        maxWidth: 300,
        maxHeight: 200,
    },
});

export default SignIn;