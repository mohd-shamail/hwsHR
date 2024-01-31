import { View, Text } from 'react-native'
import BottomNav from '../navigation/BottomNav'

import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import ScannerScreen from './ScannerScreen';
const DrawerNavigation = createDrawerNavigator();
const Sidebar = () => {
    
    const isFocused = useIsFocused();
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetchUser();
    }, [isFocused]);
    const fetchUser = async () => {
        try {
            const value = await AsyncStorage.getItem("userData");
            const vd = JSON.parse(value);
            setUser(vd);
            // alert(vd.name)
        } catch (e) {
            alert("Error")
        }
    }
  return (
    <View style={{ flex:1 }}>
        <BottomNav/>
        {user && (
        (user.email === "aakash.vaidya@henryharvin.in" ||
          user.email === "admin@henryharvin.com" ||
          user.email === "ghanshyam@henryharvin.in" ||
          user.email === "ab1.yv@henryharvin.in" ||
          user.email === "guard@henryharvin.com" ) && (
          <>
            <DrawerNavigation.Screen
              name="Scanner"
              options={{ headerShown: false }}
              component={ScannerScreen}
            />
            
          </>
        )
      )}
    </View>
  )
}

export default Sidebar