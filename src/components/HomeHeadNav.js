import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "../globals/style";

const HomeHeadNav = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Fontisto
        name="nav-icon-list-a"
        size={20}
        color="black"
        style={styles.myicon}
      />
      <View style={styles.containerin}>
        <Text style={styles.mytext}>Foodie</Text>
        <MaterialCommunityIcons
          name="food-outline"
          size={26}
          color="black"
          style={styles.myicon2}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("userprofile");
        }}
      >
        <FontAwesome5
          name="user-circle"
          size={26}
          color="black"
          style={styles.myicon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeadNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    backgroundColor: colors.col1,
    elevation: 20,
    shadowColor: "#000",
    shadowRadius: 20,
    shadowOpacity: 0.5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  containerin: {
    margin: 2.5,
    flexDirection: "row",
    alignItems: "center",
  },
  myicon: {
    color: colors.text1,
    marginRight: 30,
    marginLeft: 25,
  },
  myicon2: {
    color: colors.text1,
  },
  mytext: {
    color: colors.text1,
    fontSize: 24,
  },
});
