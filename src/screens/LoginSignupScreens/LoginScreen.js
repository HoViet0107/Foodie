import React, { useState } from "react";
import {
  Statusbar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { titles, colors, btn1, hr80 } from "../../globals/style";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { firebase } from "../../../Firebase/firebaseConfig";

const LoginScreen = ({ navigation }) => {
  const [emailfocus, setEmailfocus] = useState(false);
  const [passwordfocus, setPasswordfocus] = useState(false);
  const [showpassword, setShowpassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerror, setcustomError] = useState("");

  const handlelogin = () => {
    firebase
      .auth()
      //sử dụng phương thức signInWithEmailAndPassword của
      //Firebase để xác thực email và mật khẩu mà người dùng đã nhập.
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // chuyển hướng đến trang chào mừng "welcomepage"
        navigation.navigate("welcomepage");
      })
      .catch((error) => {
        //Nếu có lỗi xảy ra, lỗi sẽ được catch và errorMessage sẽ được hiển thị
        var errorMessage = error.message;
        console.log(errorMessage);
        if (
          errorMessage ===
          "Firebase: The email address is badly formatted. (auth/invalid-email)."
        ) {
          setcustomError("Nhập lại email!");
        } else {
          setcustomError("Mật khẩu hoặc email không đúng!");
        }
      });
  };

  return (
    <View style={styles.container}>
      {/* <Statusbar /> */}
      <Text style={styles.head1}>Sign In</Text>
      {customerror !== "" && <Text style={styles.errormsg}>{customerror}</Text>}
      <View style={styles.inputout}>
        <AntDesign
          name="user"
          size={24}
          color={emailfocus === true ? colors.text1 : colors.text2}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onFocus={() => {
            setEmailfocus(true);
            setPasswordfocus(false);
            setShowpassword(false);
            setcustomError("");
          }}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputout}>
        <MaterialCommunityIcons
          name="lock-outline"
          size={24}
          color={passwordfocus == true ? colors.text1 : colors.text2}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onFocus={() => {
            setEmailfocus(false);
            setPasswordfocus(true);
            setcustomError("");
          }}
          secureTextEntry={showpassword === false ? true : false}
          onChangeText={(text) => setPassword(text)}
        />

        <Octicons
          name={showpassword == false ? "eye-closed" : "eye"}
          size={24}
          color="black"
          onPress={() => setShowpassword(!showpassword)}
        />
      </View>
      <TouchableOpacity style={btn1} onPress={() => handlelogin()}>
        <Text
          style={{
            color: colors.col1,
            fontSize: titles.btntxt,
            fontWeight: "bold",
          }}
        >
          Đăng nhập
        </Text>
      </TouchableOpacity>

      <Text style={styles.forgot}>Quên mật khẩu?</Text>
      {/* <Text style={styles.or}>HOẶC</Text> */}
      {/* <Text style={styles.gftxt}>Đăng nhập với </Text>

      <View style={styles.gf}>
        <TouchableOpacity>
          <View style={styles.gficon}>
            <AntDesign name="google" size={24} color="#EA4335" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={styles.gficon}>
            <FontAwesome5 name="facebook-f" size={24} color="#4267B2" />
          </View>
        </TouchableOpacity>
      </View> */}
      <View style={hr80}></View>
      <Text>
        Chưa có tài khoản?
        <Text
          style={styles.signup}
          onPress={() => navigation.navigate("signup")}
        >
          Đăng ký
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  head1: {
    fontSize: titles.title1,
    color: colors.text1,
    textAlign: "center",
    marginVertical: 10,
  },
  inputout: {
    flexDirection: "row",
    width: "80%",
    marginVertical: 10,
    backgroundColor: colors.col1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // alignSelf: 'center',
    elevation: 20,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: "80%",
    outlineStyle: "none",
  },
  forgot: {
    color: colors.text2,
    marginTop: 20,
    marginBottom: 10,
  },
  or: {
    color: colors.text1,
    marginVertical: 10,
    fontWeight: "bold",
  },
  gftxt: {
    color: colors.text2,
    marginVertical: 10,
    fontSize: 25,
  },
  gf: {
    flexDirection: "row",
  },
  gficon: {
    backgroundColor: "white",
    width: 50,
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 20,
  },
  signup: {
    color: colors.text1,
  },
  errormsg: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

export default LoginScreen;
