import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Colors } from "../components/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from "axios";
import { Camera } from 'expo-camera';

import FormData from 'form-data';

export default function QRCodeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState(null)
  const [date, setDate] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [location, setLocation] = useState(null)

  const [lastScan, setLastScan] = useState('NA')
  const [showPunchInButton, setShowPunchInButton] = useState(false);
  const [showPunchOutButton, setShowPunchOutButton] = useState(false);
  const [showFlagForBothHide, setFlagForBothHide] = useState(false);
  const [showIsWithInRange, setIsWithInRange] = useState(false);
  const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [buttonAction, setButtonAction] = useState(null);
  const [data, setData] = useState({});
 

  const fetchUser = async (location) => {
    try {
      const value = await AsyncStorage.getItem('userData')
      const dV = JSON.parse(value)
      setUser(dV)
      setSessionId(dV.id)
      var date = moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
      setDate(moment().utcOffset('+05:30').format('DD-MM-YYYY HH:mm:ss'))
      var qd = { name: dV.name, email: dV.email, id: dV.id, date: date, lat: location.coords.latitude, lon: location.coords.longitude }
      setLocation(location)
      fetchLastScan(dV.id)
      setIsLoading(false)
      setQrCode(JSON.stringify(qd))

      var userLatitude = location.coords.latitude;
      var userLongitude = location.coords.longitude;
      


      const targetLocations =  [
        { latitude: 30.739817, longitude: 76.785271 }, //Chandigarh
        { latitude: 28.5936719, longitude: 77.3164147 }, //Noida
        { latitude: 28.4999064, longitude: 77.0794741 }, //Gurgaon 
        { latitude: 22.544835, longitude: 88.348049 }, //WB
        { latitude: 19.116306, longitude: 72.863251 }, //Mumbai 
        { latitude: 18.5584617, longitude: 73.777708 }, //Pune 
        { latitude: 12.937593, longitude: 77.626808 }, //Bengaluru 
        { latitude: 13.058512, longitude: 80.263100 }, //Chennai 
        { latitude: 9.984453, longitude: 76.281639 }, //Ernakulam 
        { latitude: 17.451258, longitude: 78.370964 }, //Hyderabad 
        { latitude: 17.452164, longitude: 78.3699214 }, //Hyderabad 
        { latitude: 25.1881769, longitude: 55.2692599 }, //Dubai 
        { latitude: 25.1880303, longitude: 55.2715541 }, //Dubai 
        { latitude: 28.703676, longitude: 77.259552 }, //Wazirabad,Delhi 
        // { latitude: 28.593395, longitude:  77.317024 }, //test
      
    ];

      const isWithinRange = targetLocations.some((target) => {
        const distance = calculateDistance(
          userLatitude,
          userLongitude,
          target.latitude,
          target.longitude
        );
        return distance <= 50; // Adjust the range as needed
      });
      
      setIsWithInRange(isWithinRange);
      

    } catch (e) {
      console.log(e)
    }
  }

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    } else {
      setErrorMsg(null)
    }

    let location = await Location.getCurrentPositionAsync({});
    // setLocation();
    fetchUser(location)
  }

  const fetchLastScan = (mid) => {
    axios.get('https://hr.henryharvin.com/api/checkButtonCondition?mid=' + mid).then((res) => {
      const { ls,showPunchInButton, showPunchOutButton, flagForBothHide } = res.data.data;
      setLastScan(ls,flagForBothHide)

      setShowPunchInButton(showPunchInButton === 1);
      setShowPunchOutButton(showPunchOutButton === 1);
      setFlagForBothHide(showFlagForBothHide === 1);

    })
  }

  useEffect(() => {
    if (isFocused) {
      fetchLocation()
      setIsLoading(true)
    }
  }, [isFocused])


  const handlePunchIn = async () => {
    console.log("Punch In button clicked");
    try {
      const { status } = await requestCameraPermission();
      if (status === 'granted') {
        setShowCamera(true)
        setButtonAction("Punch In");
      } else {
        
        Alert.alert('Camera Permission Denied', 'Please enable camera permissions in settings.');
      }
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
    
    }
  };
  
  const handlePunchOut = async () => {
    try {
      const { status } = await requestCameraPermission();
      if (status === 'granted') {
        setShowCamera(true)
        setButtonAction("Punch Out");
      }else {
        Alert.alert(
          "Camera Permission Denied", "Please enable camera permissions in settings."
        );
      }
    } catch (error) {
      console.error("Error requesting camera permissions:", error);
    }
  };


  const sendImageToAPI = async () => {
    const options = { quality: 0.7, base64: true };
    const image = await cameraRef.current.takePictureAsync(options); 
    
    setShowCamera(false)
    if (!image.uri) {
      return;
    }
    setData(image);
    const source = image.base64;
    let base64Img = `data:image/jpg;base64,${source}`;
    const formData = new FormData();
    
    try {
     
      let apiUrl ='https://hr.henryharvin.com/api/pushLocationPunch';
      let data = {
        'punchType': buttonAction,
        'id': sessionId,
        'file': base64Img,
      };

      const response = await fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json', // Specify the content type
        },
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json(); 

      if (responseData.success == true) { 
        
        Alert.alert('', responseData.message, [
          {
            text: 'OK',
            onPress: () => {
              // Call your fetchLastScan function
              fetchLastScan(sessionId);
            },
          },
        ]);
      }
      
    } catch (error) {
      alert('Error uploading image');
    }
   
  };
  

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Earth's radius in kilometers
  
    // Convert latitude and longitude from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);
  
    // Haversine formula
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c * 1000;
  
    return distance; 
  }
  
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }


  if (errorMsg) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
        <View >
          <Text style={{ padding: 20, textAlign: 'center' }}>{errorMsg}</Text>
        </View>
      </SafeAreaView>
    )
  } else {
    if (isLoading) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
          <View style={{ flexDirection: "column", height: "100%", width: "100%" }}>
          
          <View>
            <SafeAreaView>
              <View>
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingTop: 30,
                    flexDirection: "row",
                  }}
                >
                  <View>
                   
                    {user && 
                      <Text
                        style={{
                          fontSize: 36,
                          color: Colors.white,
                          fontWeight: "800",
                          marginTop: 50,
                        }}
                      >
                       <Text style={styles.greetingTitle}> Loading...</Text>
                      </Text>
                    }
                  </View>
                  
                </View>

                <View style={{ padding: 30 }}>
                  <View
                    style={{
                      backgroundColor: '#F2F1EB',
                      padding: 20,
                      minHeight: 150,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Text >Please wait while QR Code is being loaded</Text>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </View>
          </View>
        </SafeAreaView>
        
      );
    } else {
      return (
     
           <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
              <View>
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingTop: 30,
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 0.9 }}>
                    {/* <Text
                      style={{
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: "600",
                      }}
                    >
                      Welcome,
                    </Text> */}
                    {user &&
                      <Text
                        style={{
                          fontSize: 36,
                          color: Colors.white,
                          fontWeight: "800",
                          marginTop: 50,
                        }}
                      >
                      <Text style={styles.greetingTitle}>{showCamera ? "Image Capturing...." : "QR For Attendance"}</Text>
                      
                      </Text>
                    }
                  </View>
                </View>

                <View style={{ padding: 20 }}>
                  {showCamera ? (
                    // Render the camera view here
                    <View
                      style={{
                        height: 480,
                        width: "99%",
                        
                      }}
                    >
                      <Camera
                        ref={cameraRef}
                        style={{ flex: 1 }}
                        type={Camera.Constants.Type.front} // Use the front camera
                        autoFocus={Camera.Constants.AutoFocus.on}
                      >
                        <TouchableOpacity
                          onPress={() => setShowCamera(false)} // Close the camera view
                          style={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            padding: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: 5,
                            
                          }}
                        >
                          <Text>Close</Text>
                        </TouchableOpacity>

                        
                      </Camera>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: Colors.white,
                        padding: 50,
                        minHeight: 150,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 5,
                        
                      }}
                    >
                      {qrCode &&
                        <QRCode value={qrCode} size={200} logoBackgroundColor='#fff' logo={require('../assets/logo_purple.png')} enableLinearGradient={true} linearGradient={['#FC466B', '#3F5EFB']} gradientDirection={[0, 0, 1, 0]} logoMargin={2} logoBorderRadius={10} />
                      }

                      {/* Display the captured image here */}
                      {/* {data.uri && (
                        <Image
                          source={{ uri: data.uri }}
                          style={{ width: 100, height: 100, marginTop: 20 }}
                        />
                      )} */}
                      <View style={{ marginTop: 20 }}>
                        <Text style={{ fontWeight: '600' }}>Time: {date}</Text>
                        <Text style={{ marginTop: 10, fontWeight: '600' }}>Latitude: {location.coords.latitude}</Text>
                        <Text style={{ marginTop: 10, fontWeight: '600' }}>Longitude: {location.coords.longitude}</Text>
                        <Text style={{ marginTop: 10, fontWeight: '600', color: Colors.tomato }}>Last Scan Time: {lastScan}</Text>
                      </View>
                    </View>
                  )}

                  
                  {/* Conditionally render buttons based on state variables */}
                  {!showCamera && !showFlagForBothHide && showIsWithInRange && showPunchInButton && (
                    <TouchableOpacity
                    onPress={handlePunchIn}
                      style={{
                        backgroundColor: Colors.darkgreen,
                        marginTop: 20,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: Colors.white, fontWeight: "bold" }}>
                        Punch In
                      </Text>
                    </TouchableOpacity>
                  )}

                  {!showCamera && !showFlagForBothHide && showIsWithInRange && showPunchOutButton && (
                    <TouchableOpacity
                      onPress={handlePunchOut}
                      style={{
                        backgroundColor: Colors.tomato,
                        marginTop: 20,
                        paddingVertical: 15,
                        paddingHorizontal: 30,
                        borderRadius: 5,
                        alignItems: "center",
                        
                        
                      }}
                    >
                      <Text style={{ color: Colors.white, fontWeight: "bold" ,fontSize:15 }}>
                        Punch Out
                      </Text>
                    </TouchableOpacity>
                    
                  )}
                  
                  {showCamera &&(
                    <TouchableOpacity
                      onPress={sendImageToAPI}
                      style={{
                        backgroundColor: Colors.black,
                        marginTop: 20,
                        paddingVertical: 15,
                        paddingHorizontal: 20,
                        borderRadius: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: Colors.white, fontWeight: "bold" }}>
                        Submit 
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </SafeAreaView>
         
      );
    }


  }
  

}
const styles = StyleSheet.create({
   
  greeting: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    marginBottom: 12,
  },
  greetingTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a2525',
  },
 
});
