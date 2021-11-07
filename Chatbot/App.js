import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SelectionScreen from './screens/SelectionScreen.js';
import ChatScreen from './screens/ChatScreen.js';

const Stack = createStackNavigator();
const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SelectionScreen" component={SelectionScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

class App extends Component {
  render() {
    return (
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
    );
  }
}

export default App;