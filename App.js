import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import NotificationScreen from "./screens/Notification";
import LandingPage from "./screens/LandingPage";
import DrawerScreen from "./navigation/Drawer";
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
      <Stack.Screen name="LandingPage" component={LandingPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Drawer" component={DrawerScreen} />
      <Stack.Screen name="Notification" 
        options={{
            headerShown: false,
            headerLeft: () => (
                <TouchableOpacity
                style={{ marginLeft: 16 }}
                onPress={() => navigation.goBack()}
                >
                {/* You can customize the back button icon */}
                <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
            ),
        }} component={NotificationScreen} />
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <StatusBar style={{color: '#e8ecf4'}}/>
      <App/>
    </NavigationContainer>
  );
}
