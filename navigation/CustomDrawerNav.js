import React from "react";
import { ImageBackground, View } from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { primaryColor } from "../components/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomNavigationBar = (props) => {
  const userData = props.data;
  console.log(userData);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
    } catch (e) {
      // remove error
    }
    props.navigation.navigate("Login");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: primaryColor }}
      >
        <ImageBackground
          source={require("../assets/drawerbg.jpg")}
          style={{ padding: 20 }}
        >
          <View className="mx-3">
            {userData ? (
              <Avatar.Image
                size={75}
                source={{
                  uri: userData.profile_picture || undefined,
                }}
              ></Avatar.Image>
            ) : (
              <Avatar.Icon
                size={75}
                icon="account"
                style={{ backgroundColor: "transparent" }}
              />
            )}

            <View className="pt-22 mt-3">
              <Text variant="titleMedium" className="text-white font-bold">
                {userData ? userData.name : "User_name"}
              </Text>
              <View></View>
              {/* <View className="">
                <Text variant="titleSmall" className="text-white">
                  {userData ? userData.department : "department"}
                </Text> */}
                {/* <View>
                  <IconButton
                    style={{ marginBottom: -15, marginTop: -13 }}
                    icon="chevron-down"
                    iconColor={"white"}
                    size={30}
                    onPress={() => console.log("Pressed")}
                  />
                </View> */}
              {/* </View> */}
            </View>
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{ padding: 30, borderTopWidth: 1.5, borderTopColor: "#ccc" }}
      >
        {userData && (
          <View className="flex-row justify-between">
            <View>
              <TouchableOpacity
                onPress={() => {
                  logout();
                }}
                style={{ paddingVertical: 10 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="power" color={primaryColor} size={22} />
                  <Text style={{ fontSize: 15, marginLeft: 3 }}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* <View className="mt-3">
            <Text>Ver: 1.0.0</Text>
          </View> */}

        {/* <View>
          <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="information-circle-outline"
                color={primaryColor}
                size={22}
              />
              <Text
                style={{ fontSize: 15, marginLeft: 5, fontStyle: "italic" }}
              >
                Help and feedback
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};

export default CustomNavigationBar;
