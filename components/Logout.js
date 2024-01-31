import React, { useEffect, useState} from "react";
import { View, TouchableOpacity, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'

const DrawerContent = (props) => {
  const isFocused = useIsFocused()
  const [user, setUser] = useState(null)
  const fetchUser = async () => {
    try {
      const value = await AsyncStorage.getItem('userData')
      const dV = JSON.parse(value)
      setUser(dV)
      fetchLastScan(dV.id)
    } catch (e) {
      // error reading value
    }
  }
  useEffect(() => {
    if (isFocused) {
      fetchUser()
    }
  }, [isFocused])
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      // Add additional logic for clearing any other user-related data or performing other actions on logout
    } catch (e) {
      console.error('Error during logout:', e);
    }
    props.navigation.navigate('Login');
  };

  return (
    <View style={{ flex: 1 }}>
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
    {user && user.email === 'aakash.vaidya@henryharvin.in' && (
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }} onPress={logout}>
        <AntDesign name="logout" size={24} color="black" />
        <Text style={{ marginLeft: 16 }}>Logout</Text>
      </TouchableOpacity>
    )}
  </View> 
  );
};

export default DrawerContent;
