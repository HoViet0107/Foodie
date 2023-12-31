import React, { useState } from "react";
import {
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
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import { firebase } from "../../../Firebase/firebaseConfig";

const SignupScreen = ({ navigation }) => {
  const [emailfocus, setEmailfocus] = useState(false);
  const [passwordfocus, setPasswordfocus] = useState(false);
  const [phonefocus, setPhonefocus] = useState(false);
  const [namefocus, setNamefocus] = useState(false);

  const [showpassword, setShowpassword] = useState(false);
  const [showcpassword, setShowcpassword] = useState(false);
  const [cpasswordfocus, setcPasswordfocus] = useState(false);

  //taking form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // console.log(email);

  const [customError, setCustomError] = useState("");
  const [successmsg, setSuccessmsg] = useState(null);

  // const [useruid, setUseruid] = useState('');
  const handleSignup = () => {
    // kiểm tra mật khẩu và mật khẩu xác nhận
    if (password != cpassword) {
      setCustomError("Mật khẩu không khớp");
      return; // Thoát khỏi hàm
    } else if (phone.length != 10) {
      // kiểm tra sđt
      setCustomError("Số điện thoại không đúng");
      return;
    }
    // tạo người dùng với email và mật khẩu được cung cấp
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          console.log(userCredentials?.user.uid);
          console.log("user created");
          if (userCredentials?.user.uid != null) {
            // nếu người dùng dc tạo thành công, thêm vào firestore
            const userRef = firebase.firestore().collection("UserData");
            userRef
              .add({
                email: email,
                password: password,
                phone: phone,
                name: name,
                address: address,
                uid: userCredentials?.user?.uid,
              })
              .then(() => {
                console.log("Thêm dữ liệu vào firestore");
                setSuccessmsg("User created!");
              })
              .catch((error) => {
                console.log("firestore error ", error);
              });

            // create cart
            const userRefCart = firebase.firestore().collection("UserCart");
            userRefCart.add({
              uid: userCredentials?.user?.uid,
            });
          }
        })
        .catch((error) => {
          console.log("Đăng ký firebase thất bại ", error.message);
          if (
            error.message ==
            "Firebase: Email đã được đăng ký. (auth/email-already-in-use)."
          ) {
            setCustomError("Email đã tồn tại");
          } else if (
            error.message ==
            "Firebase: The email address is badly formatted. (auth/invalid-email)."
          ) {
            setCustomError("Invalid Email");
          } else if (
            error.message ==
            "Firebase: Mật khẩu it nhất 6 ký tự (auth/weak-password)."
          ) {
            setCustomError("Mật khẩu it nhất 6 ký tự");
          } else {
            setCustomError(error.message);
          }
        });
    } catch (error) {
      console.log("Đăng ký thất bại ", error.message);
    }
  };
  return (
    <View style={styles.container}>
      {successmsg == null ? (
        <View style={styles.container}>
          <Text style={styles.head1}>Đăng ký</Text>
          {customError !== "" && (
            <Text style={styles.errormsg}>{customError}</Text>
          )}
          <View style={styles.inputout}>
            <AntDesign
              name="user"
              size={24}
              color={namefocus === true ? colors.text1 : colors.text2}
            />
            <TextInput
              style={styles.input}
              placeholder="Họ Tên"
              onFocus={() => {
                setEmailfocus(false);
                setPasswordfocus(false);
                setShowpassword(false);
                setNamefocus(true);
                setPhonefocus(false);
                setcPasswordfocus(false);
                setCustomError("");
              }}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={styles.inputout}>
            <Entypo
              name="email"
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
                setNamefocus(false);
                setPhonefocus(false);
                setcPasswordfocus(false);
                setCustomError("");
              }}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          {/*  */}

          <View style={styles.inputout}>
            <Feather
              name="smartphone"
              size={24}
              color={phonefocus === true ? colors.text1 : colors.text2}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              onFocus={() => {
                setEmailfocus(false);
                setPasswordfocus(false);
                setShowpassword(false);
                setNamefocus(false);
                setPhonefocus(true);
                setcPasswordfocus(false);
                setCustomError("");
              }}
              onChangeText={(text) => setPhone(text)}
            />
          </View>

          {/* password start */}
          <View style={styles.inputout}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color={passwordfocus == true ? colors.text1 : colors.text2}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              onFocus={() => {
                setEmailfocus(false);
                setPasswordfocus(true);
                setShowpassword(false);
                setNamefocus(false);
                setPhonefocus(false);
                setcPasswordfocus(false);
                setCustomError("");
              }}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={showpassword === false ? true : false}
            />

            <Octicons
              name={showpassword == false ? "eye-closed" : "eye"}
              size={24}
              color="black"
              onPress={() => setShowpassword(!showpassword)}
            />
          </View>
          {/*  */}
          <View style={styles.inputout}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color={cpasswordfocus == true ? colors.text1 : colors.text2}
            />
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              onFocus={() => {
                setEmailfocus(false);
                setPasswordfocus(false);
                setShowpassword(false);
                setNamefocus(false);
                setPhonefocus(false);
                setcPasswordfocus(true);
                setCustomError("");
              }}
              onChangeText={(text) => setcPassword(text)}
              secureTextEntry={showcpassword === false ? true : false}
            />

            <Octicons
              name={showcpassword == false ? "eye-closed" : "eye"}
              size={24}
              color="black"
              onPress={() => setShowcpassword(!showcpassword)}
            />
          </View>
          {/* password end */}

          <Text style={styles.address}>Hãy nhập địa chỉ của bạn!</Text>
          <View style={styles.inputout}>
            <TextInput
              style={styles.input1}
              placeholder="Nhập địa chỉ"
              onChangeText={(text) => setAddress(text)}
              onFocus={() => {
                setEmailfocus(false);
                setPasswordfocus(false);
                setShowpassword(false);
                setNamefocus(false);
                setPhonefocus(false);
                setcPasswordfocus(false);
                setCustomError("");

                setCustomError("");
              }}
            />
          </View>

          <TouchableOpacity style={btn1} onPress={() => handleSignup()}>
            <Text
              style={{
                color: colors.col1,
                fontSize: titles.btntxt,
                fontWeight: "bold",
              }}
            >
              Đăng ký
            </Text>
          </TouchableOpacity>

          {/* <Text style={styles.forgot}>Quên mật khẩu?</Text> */}
          {/* <Text style={styles.or}>HOẶC</Text>
          <Text style={styles.gftxt}>Đăng nhập với </Text>

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
            Bạn đã có tài khoản?
            <Text
              style={styles.signup}
              onPress={() => navigation.navigate("login")}
            >
              {" "}
              Đăng nhập
            </Text>
          </Text>
        </View>
      ) : (
        <View style={styles.container1}>
          <Text style={styles.successmessage}>{successmsg}</Text>
          <TouchableOpacity
            style={btn1}
            onPress={() => navigation.navigate("login")}
          >
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

          <TouchableOpacity style={btn1} onPress={() => setSuccessmsg(null)}>
            <Text
              style={{
                color: colors.col1,
                fontSize: titles.btntxt,
                fontWeight: "bold",
              }}
            >
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    // justifyContent: 'center',
    // marginTop: 60,
  },
  container1: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
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
  input1: {
    outlineStyle: "none",
    width: "100%",
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
    marginBottom: 10,
    fontSize: 25,
  },
  gf: {
    flexDirection: "row",
  },
  gficon: {
    backgroundColor: "white",
    width: 50,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 20,
  },
  signup: {
    color: colors.text1,
  },
  address: {
    fontSize: 18,
    color: colors.text2,
    textAlign: "center",
    marginTop: 20,
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
  successmessage: {
    color: "green",
    fontSize: 18,
    textAlign: "center",
    margin: 10,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});

export default SignupScreen;
