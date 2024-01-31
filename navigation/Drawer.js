import { SafeAreaView } from "react-native";
import BottomNav from "../navigation/BottomNav";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import ScannerScreen from "../screens/ScannerScreen";
import ScannerScreenTest from "../screens/ScannerScreenTest";
import LeaveApply from "../screens/LeaveApply";
import DrawerContent from "../components/Logout";
import axios from "axios";
import CustomNavigationBar from "./CustomDrawerNav";
import { primaryColor } from "../components/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const DrawerNavigation = createDrawerNavigator();

const Drawer = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);
  const [drawerItems, setDrawerItems] = useState(null);
  const [isEmailMatch, setIsEmailMatch] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  //console.log(drawerItems)

  const fetchUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      const vd = JSON.parse(value);
      setUser(vd);
      setUserEmail(vd.email);
      // alert(vd.name)
    } catch (e) {
      //alert("Error");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isFocused]);

  useEffect(() => {
    // Fetch drawer items dynamically based on user info
    const fetchDrawerItems = async () => {
      try {
        const response = await axios.get(
          `https://hr.henryharvin.com/api/sidebar-email-access`
        );
        const apiData = response?.data;
        const emaildata = apiData.flat();
        setDrawerItems(emaildata);
        //console.log("emaildata = " , emaildata);
      } catch (error) {
        console.error("Error fetching drawer items:", error);
      }
    };
    if (user) {
      fetchDrawerItems();
    }
  }, [user]);
  //console.log(user)

  useEffect(() => {
    if (drawerItems && userEmail) {
      const emailMatch = drawerItems.some((value) => value.email === userEmail);
      setIsEmailMatch(emailMatch);
    }
  }, [drawerItems,userEmail]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <DrawerNavigation.Navigator
        drawerContent={(props) => <CustomNavigationBar data = {user} {...props } />}
        initialRouteName="Dashboard"
        screenOptions={{
          drawerLabelStyle: {
            marginLeft: -25,
            fontSize: 15,
            fontWeight: "500",
          },
          drawerActiveTintColor: "white",
          drawerActiveBackgroundColor: primaryColor,
          drawerInactiveTintColor: "#333",
        }}
      >
        <DrawerNavigation.Screen
          name="Dashboard"
          component={BottomNav}
          options={{
            headerShown: false,
            drawerIcon: ({ color }) => (
              <Ionicons name="briefcase" color={color} size={22} />
            ),
          }}
        />
        {user && isEmailMatch && ( 
          <>
            <DrawerNavigation.Screen
              name="Scanner"
              options={{
                headerShown: false,
                drawerIcon: ({ color }) => (
                  <Ionicons name="camera" color={color} size={22} />
                ),

                // headerLeft: () => (
                //     <TouchableOpacity
                //     style={{ marginLeft: 16 }}
                //     onPress={() => navigation.goBack()}
                //     >
                //     {/* You can customize the back button icon */}
                //     <AntDesign name="arrowleft" size={24} color="black" />
                //     </TouchableOpacity>
                // ),
              }}
              component={ScannerScreen}
            />
            {user.email === "aakash.vaidya@henryharvin.in" && (
              <DrawerNavigation.Screen
                name="Scanner Test"
                options={{ headerShown: false }}
                component={ScannerScreenTest}
              />
            )}
          </>
        )}
        {/* <DrawerNavigation.Screen
          name="Leave"
          component={LeaveApply}
          options={{
            headerShown: false,
            drawerIcon: ({ color }) => (
              <Ionicons name="calendar" color={color} size={22} />
            ),
          }}
        /> */}
      </DrawerNavigation.Navigator>
    </SafeAreaView>
  );
};

export default Drawer;
