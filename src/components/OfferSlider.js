import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
// import Swiper from "react-native-swiper/src";
import { colors } from "../globals/style";
// import Carousel from "react-native-swipeable-carousel";

const data = [
  "https://cdn.pixabay.com/photo/2017/12/09/16/41/snow-man-3008179_1280.jpg",
  "https://cdn.pixabay.com/photo/2017/12/09/16/42/snow-man-3008179_1280.jpg",
];
const OfferSlider = () => {
  return (
    <View>
      <View style={styles.offerSlider}>
        {/* <Carousel images={data} enableGestureSwipe={true} /> */}
        <Swiper
          autoplay={true}
          autoplayTimeout={5}
          showsButtons={true}
          dotColor={colors.text2}
          activeDotColor={colors.text1}
          nextButton={<Text style={styles.buttonText}>›</Text>}
          prevButton={<Text style={styles.buttonText}>‹</Text>}
        >
          <View style={styles.slide}>
            <Image
              source={require("../../assets/OfferSliderImages/img1.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require("../../assets/OfferSliderImages/img2.png")}
              style={styles.image}
            />
          </View>
          <View style={styles.slide}>
            <Image
              source={require("../../assets/OfferSliderImages/img3.png")}
              style={styles.image}
            />
          </View>
        </Swiper>
      </View>
    </View>
  );
};

export default OfferSlider;

const styles = StyleSheet.create({
  offerSlider: {
    width: "100%",
    height: 200,
    backgroundColor: colors.col1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  slide: {
    width: "100%",
    height: 200,
    backgroundColor: colors.col1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  buttonText: {
    color: colors.text1,
    fontSize: 40,
    fontWeight: "500",
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    textAlign: "center",
    lineHeight: 40,
  },
});
