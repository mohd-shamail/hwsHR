import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  BackHandler,
} from "react-native";
import axios from "axios";
import { primaryColor } from "../components/Colors";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, IconButton } from "react-native-paper";

export default function Home({ navigation }) {
  const [holidayData, setHoliday] = useState(null);
  const [lastScan, setLastScan] = useState("N.A.");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      fetchUser();
      fetchHolidays();
      fetchUserData();
      const backAction = () => {
        // Handle the back button press only when the Home screen is focused
        if (isFocused) {
          BackHandler.exitApp();
          // Alert.alert("Exit App", "Are you sure you want to exit?", [
          //   {
          //     text: "Cancel",
          //     onPress: () => null,
          //     style: "cancel",
          //   },
          //   {
          //     text: "Exit",
          //     onPress: () => BackHandler.exitApp(),
          //   },
          // ]);
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // Clean up the event listener when the component is unmounted
      return () => backHandler.remove();
    }
  }, [isFocused]);

  //const id = 1579;
 
  const fetchUserData = async (id) => {
    try {
       axios.get(
        `https://hr.henryharvin.com/api/dashboard-data/${id}`).then((res) => {
         setUserData(res.data);
       })
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchHolidays = async () => {
    axios.get("https://hr.henryharvin.com/api/getHolidays").then((res) => {
      setHoliday(res.data);
    });
  };
  const today = new Date();

  const isUpcoming = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const holidayDate = new Date(year, month - 1, day);
    return holidayDate > today;
  };
  const upcomingHolidays =
    holidayData?.data.filter((holiday) => isUpcoming(holiday.date)) || [];
  const pastHolidays =
    holidayData?.data.filter((holiday) => !isUpcoming(holiday.date)) || [];
  const allHolidays = upcomingHolidays.concat(pastHolidays);

  const fetchUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      const dV = JSON.parse(value);
      setUser(dV);
      fetchLastScan(dV.id);
      fetchUserData(dV.id);
      // Alert.alert(user.department)
    } catch (e) {
      // error reading value
    }
  };

  const fetchLastScan = (mid) => {
    axios
      .get(`https://hr.henryharvin.com/api/check_last_scan1?mid=${mid}`)
      .then((res) => {
        setLastScan(res.data.data);
      });
  };

  // const items = [
  //   {
  //     icon: "user",
  //     label: "User-ID",
  //     value: "HH-" + (user && user.id),
  //   },
  //   {
  //     icon: "archive",
  //     label: "Total Days",
  //     value: 31,
  //   },
  //   {
  //     icon: "moon",
  //     label: "Week Off",
  //     value: 5,
  //   },
  //   {
  //     icon: "sun",
  //     label: "Total Working Days",
  //     value: 25,
  //   },
  //   {
  //     icon: "activity",
  //     label: "Your Attendance",
  //     value: 10,
  //   },
  //   {
  //     icon: "user-minus",
  //     label: "Applied Leaves",
  //     value: 1,
  //   },
  //   {
  //     icon: "list",
  //     label: "Leave Approved",
  //     value: 1,
  //   },
  // ];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.top}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              {user && (
                <Image
                  alt=""
                  source={{
                    uri: user.profile_picture,
                  }}
                  style={styles.avatar}
                />
              )}
            </TouchableOpacity>
            <IconButton
              icon="bell-outline"
              mode="contained-tonal"
              size={24}
              onPress={() => {
                navigation.navigate("Notification");
              }}
            />
          </View>
          <View style={styles.greeting}>
            {user && <Text style={styles.greetingTitle}>{user.name}</Text>}
            <Text style={styles.greetingText}>
              Last Scan: {lastScan.date} @{lastScan.time}
            </Text>
          </View>

          <View style={styles.stats}>
            {[
              { label: "Department", value: user ? user.department : "NA" },
              { label: "Location", value: user ? user.location : "NA" },
            ].map(({ label, value }, index) => (
              <View
                key={index}
                style={[
                  styles.statsItem,
                  index === 0 && { borderLeftWidth: 0 },
                ]}
              >
                <Text style={styles.statsItemText}>{label}</Text>

                <Text style={styles.statsItemValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className=" flex-1 mx-3 mt-2">
          {/* <View style={styles.stats1}> */}
          <View>
            <Card style={{ height: 50 }} className="bg-white">
              <View className="flex-row justify-between">
                <View className="flex-row mx-3 mt-3">
                  <FeatherIcon color="#8C6CAB" name="user" size={20} />
                  <Text className="text-lg mx-1">UserID</Text>
                </View>
                <View className="mx-3 mt-3">
                  <Text style={{ color: primaryColor }} className="text-lg">
                    {userData.UserId}
                  </Text>
                </View>
              </View>
            </Card>
            <Card style={{ height: 50 }} className="bg-white mt-2">
              <View className="flex-row justify-between">
                <View className="flex-row mx-3 mt-3">
                  <View className="mt-1">
                    <FeatherIcon color="#8C6CAB" name="archive" size={20} />
                  </View>
                  <Text className="text-lg mx-1">Total Days</Text>
                </View>
                <View className="mx-3 mt-3">
                  <Text style={{ color: primaryColor }} className="text-lg">
                    {userData.totalDaysinTheMonth}
                  </Text>
                </View>
              </View>
            </Card>
            <Card style={{ height: 50 }} className="bg-white mt-2">
              <View className="flex-row justify-between">
                <View className="flex-row mx-3 mt-3">
                  <View className="mt-1">
                    <FeatherIcon color="#8C6CAB" name="sun" size={20} />
                  </View>
                  <Text className="text-lg mx-1">Total Working Days</Text>
                </View>
                <View className="mx-3 mt-3">
                  <Text style={{ color: primaryColor }} className="text-lg">
                    {userData.total_working_days}
                  </Text>
                </View>
              </View>
            </Card>
            <Card style={{ height: 50 }} className="bg-white mt-2">
              <View className="flex-row justify-between">
                <View className="flex-row mx-3 mt-3">
                  <FeatherIcon color="#8C6CAB" name="activity" size={20} />
                  <Text className="text-lg mx-1">Your Attendance</Text>
                </View>
                <View className="mx-3 mt-3">
                  <Text style={{ color: primaryColor }} className="text-lg">
                    {userData.attendance}
                  </Text>
                </View>
              </View>
            </Card>
            <Card style={{ height: 50 }} className="bg-white mt-2">
              <View className="flex-row justify-between">
                <View className="flex-row mx-3 mt-3">
                  <View className="mt-1">
                    <FeatherIcon color="#8C6CAB" name="user-minus" size={20} />
                  </View>
                  <Text className="text-lg mx-1">Applied Leaves</Text>
                </View>
                <View className="mx-3 mt-3">
                  <Text style={{ color: primaryColor }} className="text-lg">
                    {userData.totalLeaveApplied}
                  </Text>
                </View>
              </View>
            </Card>
            <Card style={{ height: 50 }} className="bg-white mt-2">
              <View className="flex-row justify-between">
                <View className="flex-row mx-3 mt-3">
                  <View className="mt-1">
                    <FeatherIcon color="#8C6CAB" name="list" size={20} />
                  </View>
                  <Text className="text-lg mx-1">Leave Approved</Text>
                </View>
                <View className="mx-3 mt-3">
                  <Text style={{ color: primaryColor }} className="text-lg">
                    {userData.totalLeaveApproved}
                  </Text>
                </View>
              </View>
            </Card>

            {/* <View>
              <View className="mt-2" style={styles.statsItem1}>
                <FeatherIcon color="#8C6CAB" name="archive" size={14} />
                <Text style={styles.statsItemLabel1}>Total Days</Text>
                <Text style={styles.statsItemValue1}>
                  {userData.totalDaysinTheMonth}
                </Text>
              </View>
              </View>
              <View style={styles.statsItem1}>
                <FeatherIcon color="#8C6CAB" name="sun" size={14} />
                <Text style={styles.statsItemLabel1}>Total Working Days</Text>
                <Text style={styles.statsItemValue1}>
                  {userData.total_working_days}
                </Text>
              </View>
              <View style={styles.statsItem1}>
                <FeatherIcon color="#8C6CAB" name="activity" size={14} />
                <Text style={styles.statsItemLabel1}>Your Attendance</Text>
                <Text style={styles.statsItemValue1}>
                  {userData.attendance}
                </Text>
              </View>
              <View style={styles.statsItem1}>
                <FeatherIcon color="#8C6CAB" name="user-minus" size={14} />
                <Text style={styles.statsItemLabel1}>Applied Leaves</Text>
                <Text style={styles.statsItemValue1}>
                  {userData.totalLeaveApplied}
                </Text>
              </View>
              <View style={styles.statsItem1}>
                <FeatherIcon color="#8C6CAB" name="list" size={14} />
                <Text style={styles.statsItemLabel1}>Leave Approved</Text>
                <Text style={styles.statsItemValue1}>
                  {userData.totalLeaveApproved}
                </Text>
              </View>
            </View>
          </View> */}
          </View>
        </View>
        {/* {items.map(({ icon, label, value }, index) => (
            <View key={index} style={styles.statsItem1}>
              <FeatherIcon color="#8C6CAB" name={icon} size={14} />
              <Text style={styles.statsItemLabel1}>{label}</Text>
              <Text style={styles.statsItemValue1}>{value}</Text>
            </View>
          ))} */}
        {/* </View> */}

        <View className="mt-3" style={styles.search}>
          <Text className="text-lg mx-4 text-amber-950">Holidays</Text>
          <View style={{ padding: 10 }}>
            <FlatList
              style={{ padding: 0 }}
              data={allHolidays}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Card className="">
                    <View
                      style={{
                        backgroundColor: isUpcoming(item.date)
                          ? "#8f6e98"
                          : "#c4ded5",
                        borderRadius: 10,
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: isUpcoming(item.date) ? "white" : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {item.holiday}
                      </Text>
                      <Text
                        style={{
                          color: isUpcoming(item.date) ? "white" : "black",
                        }}
                      >
                        {item.date}
                      </Text>
                    </View>
                  </Card>
                </View>
              )}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e8ecf4",
    flex: 1,
  },
  top: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginTop: 35,
  },
  greeting: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.15)",
    marginBottom: 12,
  },
  greetingTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a2525",
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a2525",
    marginTop: 8,
  },
  searchInput: {
    height: 56,
    backgroundColor: "#f3f3f6",
    paddingHorizontal: 16,
    color: "#1a2525",
    fontSize: 18,
    borderRadius: 9999,
  },
  searchFloating: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  searchButton: {
    alignSelf: "center",
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: "#5bd2bc",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a2525",
  },
  contentLink: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a2525",
  },
  contentPlaceholder: {
    borderStyle: "dashed",
    borderWidth: 4,
    borderColor: "#e5e7eb",
    flex: 1,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerImg: {
    width: 40,
    height: 40,
    borderRadius: 9999,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
  },
  stats: {
    backgroundColor: "#F2F1EB",
    flexDirection: "row",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#90a0ca",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 1,
  },
  statsItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderLeftWidth: 1,
    borderColor: "rgba(189, 189, 189, 0.32)",
  },
  statsItemText: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 18,
    color: "#778599",
    marginBottom: 5,
  },
  statsItemValue: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#121a26",
  },

  stats1: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    marginTop: 5,
  },
  statsItem1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  statsItemLabel1: {
    marginLeft: 8,
    marginRight: "auto",
    fontSize: 15,
    fontWeight: "600",
    color: "#4e4a6d",
  },
  statsItemValue1: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4e4a6d",
  },
});
