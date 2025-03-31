// components/CalendarEmotion.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

interface Props {
  onDayPress: (dateString: string) => void;
  markedDates: any;
}

const CalendarEmotion: React.FC<Props> = ({ onDayPress, markedDates }) => {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => onDayPress(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: "#4CAF50",
          arrowColor: "#4CAF50",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
  },
});

export default CalendarEmotion;
