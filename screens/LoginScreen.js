import React, { useEffect, useState } from "react";
import { StyleSheet,Alert, SafeAreaView, View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

const INPUT_OFFSET = 110;

export default function LoginScreen({ navigation }) {
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
        const value = await AsyncStorage.getItem('userData')
        if (value !== null) {
            navigation.navigate("Drawer")
        } else {
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

  
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const checkLogin = async () => {
    try {
        const response = await axios.post("https://hr.henryharvin.com/api/apiLogin", {
            "email": form.email,
            "password": form.password
        });

        if (response.data.code === 200) {
            // Login successful, save user data to AsyncStorage
            await AsyncStorage.setItem('userData', JSON.stringify(response.data.msg));
            navigation.navigate("Drawer");
        } else {
            Alert.alert("Error", response.data.msg);
        }
    } catch (error) {
        // Handle network or other errors
        console.error("Login Error:", error);
    }
}
  const loginUser = async (user) => {
    await AsyncStorage.setItem('userData', JSON.stringify(user)).then(() => {
      navigation.navigate("Drawer")
    })

  }
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Image style={{ width: '100%', height: '100%' }} source={require('../assets/splash.png')} />
      </View>
    )
  } else {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
          <View style={styles.container}>
              <View style={styles.header}>
              <View style={styles.headerIcon}>
                  <FeatherIcon color="#075eec" name="lock" size={44} />
              </View>

              <Text style={styles.title}>
                  Welcome to <Text style={{ color: '#0742fc' }}>HWS HR</Text>
              </Text>

              <Text style={styles.subtitle}>Get access to your HR Portal</Text>
              </View>

              <View style={styles.form}>
              <View style={styles.input}>
                  <Text style={styles.inputLabel}>Email address</Text>

                  <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={email => setForm({ ...form, email })}
                  placeholder=""
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={form.email}
                  />
              </View>

              <View style={styles.input}>
                  <Text style={styles.inputLabel}>Password</Text>

                  <TextInput
                  autoCorrect={false}
                  onChangeText={password => setForm({ ...form, password })}
                  placeholder=""
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  secureTextEntry={true}
                  value={form.password}
                  />
              </View>

              <View style={styles.formAction}>
                  <TouchableOpacity
                  onPress={checkLogin}>
                  <View style={styles.btn}>
                      <Text style={styles.btnText}>Sign in</Text>
                  </View>
                  </TouchableOpacity>

                  <View style={styles.formActionSpacer} />

              
              </View>

              
              </View>
          </View>
        </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  header: {
    marginVertical: 36,
  },
  headerIcon: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginBottom: 36,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginVertical: 24,
  },
  formActionSpacer: {
    marginVertical: 8,
  },
  formFooter: {
    marginTop: 'auto',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#929292',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#fff',
    paddingLeft: INPUT_OFFSET,
    paddingRight: 24,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  inputLabel: {
    position: 'absolute',
    width: INPUT_OFFSET,
    lineHeight: 44,
    top: 0,
    left: 0,
    bottom: 0,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#c0c0c0',
    zIndex: 9,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#000',
    borderColor: '#000',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  btnSecondaryText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#000',
  },
});