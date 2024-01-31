import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import SelectDropdown from 'react-native-select-dropdown'

const lessons = [
  {
    name: 'Squat',
    cal: 22,
    duration: 10,
  },
  {
    name: 'Pull-up',
    cal: 12,
    duration: 15,
  },
];

export default function LeaveApply({ navigation }) {
  const [selectedType, setSelectedType] = useState('Type 1');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reason, setReason] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const snapPoints = useMemo(() => ['40%', '75%'], []);
  const bottomSheetRef = useRef(null);
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleClosePress = () => bottomSheetRef.current?.close();
  const snapToIndex = (index) => bottomSheetRef.current?.snapToIndex(index);


  const applyLeave = () => {
    // Implement your logic to handle leave application
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };
  const leavetype = ["Casual Sick Leave", "Half Day", "Comp-off", "LOP"]
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.containerTop}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ marginLeft: -20 }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Leave</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {lessons.map(({ name, cal, duration, img }, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // handle onPress
              }}>
              <View style={styles.card}>
                <Text style={styles.cardImg}> {index + 1}</Text>
                <View>
                  <Text style={styles.cardTitle}>{name}</Text>
                  <View style={styles.cardStats}>
                    <View style={styles.cardStatsItem}>
                      <FeatherIcon color="#636a73" name="clock" />
                      <Text style={styles.cardStatsItemText}>
                        {duration} mins
                      </Text>
                    </View>
                    <View style={styles.cardStatsItem}>
                      <FeatherIcon color="#636a73" name="zap" />
                      <Text style={styles.cardStatsItemText}>{cal} cals</Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => snapToIndex(0)} // Corrected function name and passed index 0
        >
          <Text style={styles.applyButtonText}>Apply Leave</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        animateOnMount={true}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.contentContainer}>
            {/* Close button */}
            {/* <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePress}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity> */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={styles.selectLabel}>Leave Type:</Text>
              <SelectDropdown
                data={leavetype}
                onSelect={(index) => setSelectedType(index + 1)}
                buttonTextAfterSelection={(selectedItem) => selectedItem}
                rowTextForSelection={(item) => item}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <Text style={styles.selectLabel}>From Date:</Text>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  if (date) {
                    setStartDate(date);
                  }
                }}
              />
            </View>

          </View>
        </BottomSheetScrollView>
      </BottomSheet>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    flex: 1,
    paddingBottom: 140,
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 16,
  },
  selectLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  title: {
    marginTop: 15,
    fontSize: 26,
    marginLeft: 10,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  card: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 9999,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  cardStats: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardStatsItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  cardStatsItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#636a73',
    marginLeft: 2,
  },
  applyButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollViewContainer: {
    padding: 14,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
    zIndex: 1,
    color: 'black',
    backgroundColor: 'white',
  },
});
