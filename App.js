import 'react-native-gesture-handler'; 

import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import LandingPage from './src/screens/LandingPage';
import SavedFilesPage from './src/screens/SavedFilesPage';
import MeasurementDetailScreen from './src/screens/MeasurementDetail';
import NewMeasurementScreen from './src/screens/NewMeasurement/NewMeasurementScreen';
import TestInProgressScreen from './src/screens/TestInProgress/TestInProgressScreen';
import TestResultScreen from './src/screens/TestResult';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="SavedFilesPage" component={SavedFilesPage} />
          <Stack.Screen name="MeasurementDetail" component={MeasurementDetailScreen} options={{ title: "Mérés részletei" }}/>
          <Stack.Screen name="NewMeasurement" component={NewMeasurementScreen} options={{headerShown: false}}/>
          <Stack.Screen name='TestInProgress' component={TestInProgressScreen} options={{headerShown: false}}/>
          <Stack.Screen name='TestResult' component={TestResultScreen} options={{headerShown: false}}/>
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
