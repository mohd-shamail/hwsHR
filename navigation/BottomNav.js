import React from "react";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Home from "../screens/Home";
import QRScreen from "../screens/QRScreen";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { primaryColor } from "../components/Colors";


const Tab = createMaterialBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    activeColor={primaryColor}
    inactiveColor="#3e2465"
    barStyle={{ height:68 }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarShowLabel: false, // Hide label when active
          // tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="My-QR"
        component={QRScreen}
        options={{
          // tabBarLabel: 'My-QR',
          tabBarShowLabel: false, // Hide label when active
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="qrcode-scan" color={color} size={26} />
          ),
        }}
      />

    </Tab.Navigator>
 

    // <Tab.Navigator
    // screenOptions={{
    //   headerShown: false,
    // }}
    
    //  tabBar={({ navigation, state, descriptors, insets }) => (
    //     <BottomNavigation.Bar
    //       navigationState={state}
    //       safeAreaInsets={insets}
    //       onTabPress={({ route, preventDefault }) => {
    //         const event = navigation.emit({
    //           type: 'tabPress',
    //           target: route.key,
    //           canPreventDefault: true,
    //         });

    //         if (event.defaultPrevented) {
    //           preventDefault();
    //         } else {
    //          navigation.dispatch({
    //             ...CommonActions.navigate(route.name, route.params),
    //             target: state.key,
    //           });
    //         }
    //       }}
    //       renderIcon={({ route, focused, color }) => {
    //         const { options } = descriptors[route.key];
    //         if (options.tabBarIcon) {
    //           return options.tabBarIcon({ focused, color, size: 24 });
    //         }

    //         return null;
    //       }}
    //       getLabelText={({ route }) => {
    //         const { options } = descriptors[route.key];
    //         const label =
    //           options.tabBarLabel !== undefined
    //             ? options.tabBarLabel
    //             : options.title !== undefined
    //             ? options.title
    //             : route.title;

    //         return label;
    //       }}
    //     />
    //   )}
    // >
    //   <Tab.Screen
    //     name="Home"
    //     component={Home}
    //     options={{
    //       tabBarLabel: 'Home',
    //       tabBarIcon: ({ color, size }) => {
    //         return <Icon name="home" size={size} color={color} />;
    //       },
    //     }}
    //   />
    //   <Tab.Screen
    //     name="My-QR"
    //     component={QRScreen}
    //     options={{
    //       tabBarLabel: 'My-QR',
    //       tabBarIcon: ({ color, size }) => {
    //         return <Icon name="qrcode-scan" size={size} color={color} />;
    //       },
    //     }}
    //   />
    // </Tab.Navigator>

    // <BottmNav.Navigator screenOptions={{ headerShown: false }} labeled={false}>
    //   <BottmNav.Screen
    //     name="Home"
    //     component={Home}
    //     options={{
    //       tabBarIcon: () => {
    //         return <MaterialCommunityIcons name="home-outline" size={24} />;
    //       },
    //     }}
    //   />
    //   <BottmNav.Screen
    //     name="My-QR"
    //     component={QRScreen}
    //     options={{
    //       tabBarIcon: () => {
    //         return <MaterialCommunityIcons name="qrcode-scan" size={24} />;
    //       },
    //     }}
    //   />
    // </BottmNav.Navigator>
  );
};

export default BottomNav;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});