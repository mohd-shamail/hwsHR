import React from 'react';
import { Modal, View, Text,TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CustomAlertContent = ({ visible, success, message, onClose }) => {
  const iconColor = success ? 'green' : 'red';
  const iconName = success ? 'check' : 'close';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'grey', padding: 20, borderRadius: 10, alignItems: 'center',marginTop: 40 }}>
          <View style={{ backgroundColor: iconColor, width: 80, height: 80, borderRadius: 7, marginTop: 5 }}>
            <MaterialCommunityIcons name={iconName} color="white" size={75} />
          </View>
          <Text style={{marginTop: 25,color: 'white'  }}>{message}</Text>
            <TouchableOpacity onPress={onClose}>
                <View style={{ backgroundColor: 'black',marginTop: 25 , width: 160, height: 50,justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize:20 ,  padding: 10, borderRadius: 10, alignItems: 'center' }}>Scan Again</Text>
                </View>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlertContent;
