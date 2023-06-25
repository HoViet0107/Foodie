import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

import logo from "../../../assets/logo.png";
import { colors, hr80 } from "../../globals/style";
import { firebase } from "../../../Firebase/firebaseConfig";
import Notification from "../../components/Notification";

const WelcomeScreen = ({ navigation }) => {
  const [userlogged, setUserlogged] = useState(null);
  // thôg báo
  useEffect(() => {
    Toast.show({
      text1: "Hello",
      text2: "This is some something 👋",
    });
  }, []);

  useEffect(() => {
    const checklogin = () => {
      firebase.auth().onAuthStateChanged((user) => {
        // console.log(user);
        if (user) {
          // navigation.navigate('home');
          setUserlogged(user);
        } else {
          // No user is signed in.
          console.log("no user");
        }
      });
    };
    checklogin();
  }, []);

  const handlelogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        setUserlogged(null);
        console.log("signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foodie</Text>
      <View style={styles.logoout}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={hr80} />
      <Text style={styles.text}>Đặt đồ ăn với giá cả hợp lý.</Text>
      <View style={hr80} />

      {userlogged === null ? (
        <View style={styles.btnout}>
          <TouchableOpacity onPress={() => navigation.navigate("signup")}>
            <Text style={styles.btn}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={styles.btn}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.logged}>
          <Text style={styles.txtlog}>
            Đăng nhập với{" "}
            <Text style={styles.txtlogin}>{userlogged.email}</Text>
          </Text>
          <View style={styles.btnout}>
            <TouchableOpacity onPress={() => navigation.navigate("home")}>
              <Notification />
              <Text style={styles.btn}>Trang chủ</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlelogout()}>
              <Text style={styles.btn}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff4242",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    color: colors.col1,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "200",
  },
  logoout: {
    width: "80%",
    height: "30%",
    // backgroundColor: '#fff',
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontSize: 18,
    width: "80%",
    color: colors.col1,
    textAlign: "center",
  },
  btnout: {
    flexDirection: "row",
  },
  btn: {
    fontSize: 20,
    color: colors.text1,
    textAlign: "center",
    marginVertical: 30,
    marginHorizontal: 10,
    fontWeight: "700",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  logged: {
    alignItems: "center",
  },
  txtlog: {
    fontSize: 16,
    color: colors.col1,
  },
  txtlogin: {
    fontSize: 16,
    color: colors.col1,
    fontWeight: "700",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
});
export default WelcomeScreen;
