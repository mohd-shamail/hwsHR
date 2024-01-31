import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Colors } from "../components/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import CustomAlertContent from "../components/CustomAlertContent";
import { AntDesign } from "@expo/vector-icons";

export default function ScannerScreenTest({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [sound, setSound] = useState();
  const [user, setUser] = useState();
  const [scanSuccess, setScanSuccess] = useState(null);
  const [showCustomAlert, setShowCustomAlert] = useState(false);
  const [showResMsg, setResMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const isFocused = useIsFocused();

  const fetchUser = async (location) => {
    try {
      const value = await AsyncStorage.getItem("userData");
      const dV = JSON.parse(value);
      setUser(dV);
      setLocation(location);
    } catch (e) {
      // error reading value
    }
  };
 console.log("user Data = ",user)
  useEffect( async() => {
    try {
        const { status: cameraStatus } =
          await BarCodeScanner.requestPermissionsAsync();
        
        const { status: locationStatus } =
          await Location.requestForegroundPermissionsAsync();
    
        setHasPermission(
          cameraStatus === "granted" && locationStatus === "granted"
        );
      } catch (error) {
        console.error("Error requesting permissions:", error);
        setHasPermission(false);
      }
    if (isFocused) {
      fetchUser();
      getBarCodeScannerPermissions();
    }
  }, [isFocused]);

  useEffect(() => {
    if (scanSuccess !== null) {
      const timer = setTimeout(() => {
        // setScanSuccess(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [scanSuccess]);

  async function playSound(code) {
    let soundFile;

    if (code === 200) {
      soundFile = require("../assets/Check-in.mp3");
    } else if (code === 211) {
      soundFile = require("../assets/scan_sccuess.mp3");
    } else if (code === 440) {
      soundFile = require("../assets/card_expire.mp3");
    } else if (code === 404) {
      soundFile = require("../assets/checkNotsuccess.mp3");
    } else if (code === 405) {
      soundFile = require("../assets/your-entry-time-exceed.mp3");
    } else if (code === 51) {
      soundFile = require("../assets/visitor51.mp3");
    } else if (code === 52) {
      soundFile = require("../assets/visitor52.mp3");
    } else if (code === 53) {
      soundFile = require("../assets/visitor53.mp3");
    } else if (code === 54) {
      soundFile = require("../assets/visitor54.mp3");
    } else {
      soundFile = require("../assets/error.wav");
    }

    if (soundFile) {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      setSound(sound);
      console.log("Playing Sound");
      await sound.playAsync();
    }
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    let location = await Location.getCurrentPositionAsync({});
    // setLocation();
    fetchUser(location);
    setScanned(true);
    const d = JSON.parse(data);

    console.log(location.coords.latitude, location.coords.longitude);
    var lat = location.coords.latitude;
    var long = location.coords.longitude;

    axios
      .get(
        "https://hr.henryharvin.com/api/scan_test?id=" +
          d.id +
          "&date=" +
          d.date +
          "&by=" +
          user.id +
          "&lat=" +
          lat +
          "&lon=" +
          long
      )
      .then((res) => {
        if (
          res.data.code == 441 ||
          res.data.code == 440 ||
          res.data.code == 404 ||
          res.data.code == 405 ||
          res.data.code == 54 ||
          res.data.code == 53
        ) {
          playSound(res.data.code);
          setScanSuccess(false);
          setShowCustomAlert(true);
          setResMsg(res.data.message);
        } else {
          playSound(res.data.code);
          setScanSuccess(true);
          setShowCustomAlert(true);
          setResMsg(res.data.message);
        }
      })
      .catch((e) => {
        playSound(500);
        setScanSuccess(false);
        console.error(e);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#e8ecf4" }}>
      <View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingTop: 30,
            flexDirection: "row",
            alignItems: "center", // Center items vertically
            marginLeft: 20,
            marginTop: 30,
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: -30 }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.greetingTitle}>QR Scanner for Test</Text>
        </View>

        <View style={{ padding: 30 }}>
          <View
            style={{
              backgroundColor: Colors.white,
              padding: 20,
              minHeight: 100,
              alignItems: "center",
              justifyContent: "center",
              //   borderRadius: 50,
            }}
          >
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ width: 600, height: 600 }}
            />
          </View>
        </View>
        <CustomAlertContent
          visible={showCustomAlert}
          success={scanSuccess}
          message={showResMsg}
          onClose={() => {
            setShowCustomAlert(false);
            setScanned(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  greetingTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a2525",
    marginLeft: 10,
  },
});
