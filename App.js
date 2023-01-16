import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import Devices from './src/Devices';
import Connection from './src/Connection';

const Tab = createBottomTabNavigator();

const timer = () => {
  return new Promise(res => setTimeout(res, 1000));
};

const App = () => {

  timer().then(() => {
    SplashScreen.hide();
  });


  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarLabelPosition: "beside-icon",
            tabBarLabelStyle: {
              fontSize: 20,
              fontFamily: 'DancingScript-Regular'
            },
            tabBarItemStyle: {
              width: "auto",
            },
            tabBarIconStyle: { display: "none" },
            headerTitleStyle: {
              fontSize: 30,
              fontFamily: 'DancingScript-Regular'
            },
            headerTitleAlign: 'center'
          }}
        >
          <Tab.Screen name="Devices" component={Devices} />
          <Tab.Screen name="Connection" component={Connection} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
});

export default App;
