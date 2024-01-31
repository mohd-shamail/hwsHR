import React, { useEffect, useState }from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";


export default function LandingPage({ navigation}) {
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);
    const fetchUser = async () => {
        try {
        const value = await AsyncStorage.getItem('userData')
        if (value !== null) {
            navigation.navigate("Drawer")
        }else {
          setIsLoading(false)
        }
        } catch (e) {

        }
    }
    useEffect(() => {
        if (isFocused) {
        fetchUser()
        }
    }, [isFocused])
    if (isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <Image style={{ width: '100%', height: '100%' }} source={require('../assets/splash.png')} />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.hero}>
            <Image
              source={{ uri: 'https://withfra.me/shared/Landing.3.png' }}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.content}>
            <View style={styles.contentHeader}>
              <Text style={styles.title}>
              Welcome to App!{'\n'}
                <View style={styles.appName}>
                  <Text style={styles.appNameText}>HWS HR</Text>
                </View>
              </Text>
              <Text style={styles.text}>
                The simplest and safest way to access your HR Portal.
              </Text>
            </View>
            <TouchableOpacity
            onPress={() => {
                navigation.navigate('Login');
              }}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Let's go</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#d8dffe',
    margin: 12,
    borderRadius: 16,
    padding: 16,
  },
  heroImage: {
    width: '100%',
    height: 400,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  contentHeader: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#281b52',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
  },
  appName: {
    backgroundColor: '#fff2dd',
    transform: [
      {
        rotate: '-5deg',
      },
    ],
    paddingHorizontal: 6,

  },
  appNameText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#281b52',
    marginTop: 10
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
    color: '#9992a7',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#56409e',
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
});