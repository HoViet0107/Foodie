import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeadNav from "../components/HomeHeadNav";
import { navbtn, navbtnin } from "../globals/style";
import { AntDesign } from "@expo/vector-icons";
import { colors, btn2, titles } from "../globals/style";

import { firebase } from "../../Firebase/firebaseConfig";

const Userprofile = ({ navigation }) => {
  const [userloggeduid, setUserloggeduid] = useState(null);
  const [userdata, setUserdata] = useState(null);

  useEffect(() => {
    const checklogin = () => {
      firebase.auth().onAuthStateChanged((user) => {
        // console.log(user);
        if (user) {
          // navigation.navigate('home');
          setUserloggeduid(user.uid);
        } else {
          // No user is signed in.
          console.log("no user");
        }
      });
    };
    checklogin();
  }, []);

  // console.log(userloggeduid);

  const getuserdata = async () => {
    const docRef = firebase
      .firestore()
      .collection("UserData")
      //tìm tất cả các collection trong bộ sưu tập UserData có trường
      //uid bằng với userloggeduid (id của người dùng đã đăng nhập)
      .where("uid", "==", userloggeduid);
    const doc = await docRef.get();
    if (!doc.empty) {
      doc.forEach((doc) => {
        //gán dữ liệu người dùng cho biến userdata
        setUserdata(doc.data());
      });
    } else {
      console.log("no user data");
    }
  };

  useEffect(() => {
    getuserdata();
  }, [userloggeduid]);

  // console.log(userdata);

  const [edit, setEdit] = useState(false);
  const [newname, setNewName] = useState("");
  const [newphone, setNewphone] = useState("");
  const [newaddress, setNewAddress] = useState("");

  const updateuser = async () => {
    const docRef = firebase
      .firestore()
      .collection("UserData")
      //sử dụng phương thức where() để lọc tài liệu có uid bằng với
      //userloggeduid (id người dùng đang đăng nhập) từ bảng UserData
      .where("uid", "==", userloggeduid);
    const doc = await docRef.get();
    //kiểm tra xem doc có rỗng hay không
    if (!doc.empty) {
      //thực hiện các câu lệnh cập nhật trường name, phone, address
      //nếu người dùng đã thay đổi thông tin đó
      if (newname !== "") {
        doc.forEach((doc) => {
          doc.ref.update({
            name: newname,
          });
        });
      }
      if (newphone !== "") {
        doc.forEach((doc) => {
          doc.ref.update({
            phone: newphone,
          });
        });
      }
      if (newaddress !== "") {
        doc.forEach((doc) => {
          doc.ref.update({
            address: newaddress,
          });
        });
      }
      //lấy thông tin người dùng mới
      getuserdata();
      setEdit(false);
      setPasswordedit(false);
    } else {
      console.log("Không có thông tin cá nhân");
    }
  };

  const [Passwordedit, setPasswordedit] = useState(false);
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");

  const updatepassword = async () => {
    //hàm reauthenticate xác thực lại thông tin đăng nhập của
    //người dùng bằng mật khẩu cũ trước khi cho phép cập nhật mật khẩu mới.
    const reauthenticate = (oldpassword) => {
      var user = firebase.auth().currentUser;
      var cred = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldpassword
      );
      return user.reauthenticateWithCredential(cred);
    };
    let docRef = firebase
      .firestore()
      .collection("UserData")
      .where("uid", "==", userloggeduid);
    let doc = await docRef.get();
    reauthenticate(oldpassword)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          //hàm updatePassword của đối tượng user được gọi để cập nhật mật khẩu mới
          .updatePassword(newpassword)
          .then(() => {
            if (!doc.empty) {
              doc.forEach((doc) => {
                doc.ref.update({
                  password: newpassword,
                });
              });
              alert("your password is updated");
            }
          })
          .catch((error) => {
            alert("Server Issue");
          });
      })
      .catch((error) => {
        alert("Wrong Password");
      });
  };

  const logoutuser = () => {
    firebase
      .auth()
      // sử dụng phương thức signOut của firebase auth
      .signOut()
      .then(() => {
        alert("you are logged out");
        navigation.navigate("login");
      })
      .catch((error) => {
        alert("Server Issue");
      });
  };
  return (
    <SafeAreaView style={styles.containerout}>
      <TouchableOpacity onPress={() => navigation.navigate("home")}>
        <View style={navbtn}>
          <AntDesign name="back" size={24} color="black" style={navbtnin} />
        </View>
      </TouchableOpacity>
      {edit == false && Passwordedit == false && (
        <View style={styles.container}>
          <Text style={styles.head1}>Thông tin tài khoản</Text>
          <View style={styles.containerin}>
            <Text style={styles.head2}>
              Tên:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.name}</Text>
              ) : (
                "loading"
              )}
            </Text>

            <Text style={styles.head2}>
              Email:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.email}</Text>
              ) : (
                "loading"
              )}
            </Text>

            <Text style={styles.head2}>
              SĐT:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.phone}</Text>
              ) : (
                "loading"
              )}
            </Text>

            <Text style={styles.head2}>
              Địa chỉ:{" "}
              {userdata ? (
                <Text style={styles.head2in}>{userdata.address}</Text>
              ) : (
                "loading"
              )}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEdit(!edit);
              setPasswordedit(false);
            }}
          >
            <View style={btn2}>
              <Text style={styles.btntxt}>Chỉnh sửa</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPasswordedit(!Passwordedit);
              setEdit(false);
            }}
          >
            <View style={btn2}>
              <Text style={styles.btntxt}>Đổi mật khẩu</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      {edit == true && (
        <View style={styles.container}>
          <Text style={styles.head1}>Chỉnh sửa thông tin</Text>
          <View style={styles.containerin}>
            <TextInput
              style={styles.input}
              placeholder="Họ Tên"
              onChangeText={(e) => setNewName(e)}
            />
            <TextInput
              style={styles.input}
              placeholder="SĐT"
              onChangeText={(e) => setNewphone(e)}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              onChangeText={(e) => setNewAddress(e)}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.btn2}
              onPress={() => {
                navigation.navigate("home");
                navigation.navigate("userprofile");
              }}
            >
              <View style={btn2}>
                <Text style={styles.btntxt}>Huỷ</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateuser()}>
              <View style={btn2}>
                <Text style={styles.btntxt}>Lưu</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {Passwordedit == true && (
        <View style={styles.container}>
          <Text style={styles.head1}>Change your Password</Text>
          <View style={styles.containerin}>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              onChangeText={(e) => setOldPassword(e)}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              onChangeText={(e) => setNewPassword(e)}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.btn2}
              onPress={() => {
                navigation.navigate("home");
                navigation.navigate("userprofile");
              }}
            >
              <View style={btn2}>
                <Text style={styles.btntxt}>Huỷ</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updatepassword()}>
              <View style={btn2}>
                <Text style={styles.btntxt}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity onPress={() => logoutuser()}>
        <View style={btn2}>
          <Text style={styles.btntxt}>Đăng xuất</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Userprofile;

const styles = StyleSheet.create({
  containerout: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: 'center',
    width: "100%",
  },
  head1: {
    fontSize: 40,
    fontWeight: "200",
    marginVertical: 20,
    color: colors.text1,
  },
  containerin: {
    width: "90%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.text1,
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  head2: {
    fontSize: 20,
    fontWeight: "200",
    marginTop: 20,
  },
  head2in: {
    fontSize: 20,
    fontWeight: "300",
  },
  inputout: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 10,
    backgroundColor: colors.col1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    // alignSelf: 'center',
    elevation: 20,
  },
  row: {
    flexDirection: "row",
  },
  btntxt: {
    fontSize: 20,
    fontWeight: "400",
    color: "white",
    textAlign: "center",
    padding: 10,
  },
  input: {
    width: "100%",
    marginVertical: 10,
    backgroundColor: colors.col1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.25,
    outline: "none",
  },
});
