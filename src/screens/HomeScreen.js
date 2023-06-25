import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeadNav from "../components/HomeHeadNav";
import Categories from "../components/Categories";
import OfferSlider from "../components/OfferSlider";
import { AntDesign } from "@expo/vector-icons";
import { colors, veg, nonveg } from "../globals/style";

import { firebase } from "../../Firebase/firebaseConfig";
import Cardslider from "../components/Cardslider";
import BottomNav from "../components/BottomNav";
import { windowHeight } from "../components/BottomNav";
import { SafeAreaView } from "react-native";
import { Touchable } from "react-native";
import { TouchableOpacity } from "react-native";
import { render } from "react-native-web";
import Productpage from "./Productpage";

const HomeScreen = ({ navigation }) => {
  const [foodData, setFoodData] = useState([]);
  const [VegData, setVegData] = useState([]);
  const [NonVegData, setNonVegData] = useState([]);

  // Tạo một tham chiếu đến bộ sưu tập "FoodData" trong firestore.
  const foodRef = firebase.firestore().collection("FoodData");
  //lấy dữ liệu món ăn trong collection("FoodData")
  useEffect(() => {
    //sử dụng hàm "onSnapshot" để theo dõi sự thay đổi của dữ liệu.
    foodRef.onSnapshot((snapshot) => {
      // hàm này sẽ tự động được gọi lại để lấy dữ liệu mới nhất.
      setFoodData(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  useEffect(() => {
    //lọc và đưa dữ liệu vào các biến "vegData"
    setVegData(foodData.filter((item) => item.foodType == "veg"));
    //lọc và đưa dữ liệu vào các biến "non-vegData" dựa trên foodType
    setNonVegData(foodData.filter((item) => item.foodType == "non-veg"));
  }, [foodData]);

  // search box
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />

      <HomeHeadNav navigation={navigation} />

      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation} />
      </View>

      <ScrollView>
        <View style={styles.searchbox}>
          <AntDesign
            name="search1"
            size={24}
            color="black"
            style={styles.searchicon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={(e) => {
              setSearch(e);
            }}
          />
        </View>
        {search != "" && (
          <View style={styles.seacrhresultsouter}>
            <FlatList
              style={styles.searchresultsinner}
              data={foodData}
              renderItem={({ item }) => {
                if (
                  item.foodName.toLowerCase().includes(search.toLowerCase())
                ) {
                  return (
                    <TouchableOpacity>
                      <View style={styles.searchresult}>
                        <AntDesign name="arrowright" size={24} color="black" />
                        <Text style={styles.searchresulttext}>
                          {item.foodName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              }}
            />
          </View>
        )}
        <Categories />
        {/* <OfferSlider /> */}
        {/* <Text>HomeScreen</Text> */}

        <Cardslider
          title={"Thực đơn hôm nay"}
          data={foodData}
          navigation={navigation}
        />
        <Cardslider
          title={"Đồ ăn thường"}
          data={NonVegData}
          navigation={navigation}
        />
        <Cardslider
          title={"Đồ ăn chay"}
          data={VegData}
          navigation={navigation}
        />
      </ScrollView>
      <View style={styles.clearBottom} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: colors.col1,
    width: "100%",
    height: "100%",
  },
  searchbox: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: colors.col1,
    borderRadius: 30,
    alignItems: "center",
    padding: 10,
    margin: 20,
    paddingLeft: 10,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.25,
    elevation: 10,
  },
  input: {
    marginLeft: 10,
    width: "90%",
    fontSize: 18,
    color: colors.text1,
    outlineStyle: "none",
  },
  searchicon: {
    color: colors.text1,
  },
  seacrhresultsouter: {
    width: "90%",
    marginHorizontal: 20,
    height: "auto",
    backgroundColor: colors.col1,
    elevation: 15,
    shadowColor: "#000",
    shadowRadius: 20,
    shadowOpacity: 0.25,
    marginBottom: 20,
    padding: 10,
  },
  searchresultsinner: {
    width: "90%",
  },
  searchresult: {
    width: "90%",
    flexDirection: "row",
    // alignItems: 'center',
    padding: 5,
    height: "auto",
  },
  searchresulttext: {
    marginLeft: 10,
    fontSize: 18,
    color: colors.text1,
  },
  bottomnav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: colors.col1,
    zIndex: 20,
  },
  clearBottom: {
    marginBottom: 60,
  },
});
export default HomeScreen;
