import {
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  BackHandler,
} from "react-native";
// import { NavigationActions } from "react-navigation";
import React, { useEffect, useState } from "react";
import { btn1, colors, hr80, navbtn, navbtnin } from "../globals/style";
import { firebase } from "../../Firebase/firebaseConfig";
import { getDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

const Placeorder = ({ navigation, route }) => {
  const [orderdata, setOrderdata] = useState([]);
  const [totalCost, setTotalCost] = useState("0");
  const { cartdata } = route.params;
  useEffect(() => {
    setOrderdata(JSON.parse(cartdata));
  }, [cartdata]);
  const [userloggeduid, setUserloggeduid] = useState(null);
  const [userdata, setUserdata] = useState(null);
  useEffect(() => {
    const checklogin = () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUserloggeduid(user.uid);
        } else {
          console.log("no user");
        }
      });
    };
    checklogin();
  }, []);

  useEffect(() => {
    const getuserdata = async () => {
      const docRef = firebase
        .firestore()
        .collection("UserData")
        .where("uid", "==", userloggeduid);
      const doc = await docRef.get();
      if (!doc.empty) {
        doc.forEach((doc) => {
          setUserdata(doc.data());
        });
      } else {
        console.log("no user data");
      }
    };
    getuserdata();
  }, [userloggeduid]);

  useEffect(() => {
    //Nếu cartdata != null, lấy ra thông tin giá cả và số lượng của từng sản phẩm trong giỏ hàng
    if (cartdata != null) {
      const foodprice = JSON.parse(cartdata).cart;
      let totalfoodprice = 0;
      // tính tổng giá trị của tất cả các sản phẩm trong giỏ hàng dựa trên giá và số lượng
      foodprice.map((item) => {
        // lưu trữ trong biến totalfoodprice.
        totalfoodprice =
          parseInt(item.data.foodPrice) * parseInt(item.Foodquantity) +
          totalfoodprice;
      });
      //gọi hàm setTotalCost để cập nhật giá trị tổng chi phí đơn hàng 
      //và lưu trữ giá trị này dưới dạng chuỗi JSON
      setTotalCost(JSON.stringify(totalfoodprice));
    }
  }, [cartdata]);

  useEffect(() => {
    const checklogin = () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setUserloggeduid(user.uid);
        } else {
          console.log("no user-plOrder.js");
        }
      });
    };
    checklogin();
  }, []);

  const placenow = async () => {
    //tạo một tham chiếu đến collection "UserOrders"
    //tạo một document mới với id là thời gian hiện tại (mã đơn hàng).
    const docRef = firebase
      .firestore()
      .collection("UserOrders")
      .doc(new Date().getTime().toString());
    const doc = await docRef.get();
    //kiểm tra nếu document mới không rỗng lưu thông tin của đơn hàng,
    if (!doc.empty) {
      docRef.set({
        orderid: docRef.id,
        orderdata: orderdata.cart,
        orderstatus: "Chờ xác nhận",
        ordercost: totalCost,
        orderdate: firebase.firestore.FieldValue.serverTimestamp(),
        orderaddress: userdata.address,
        orderphone: userdata.phone,
        ordername: userdata.name,
        orderuseruid: userloggeduid,
        orderpayment: "Trực tiếp",
        paymenttotal: totalCost,
      });
    }
    //tạo một tham chiếu đến collection "UserCart"
    //xóa toàn bộ giỏ hàng của người dùng hiện tại.
    const cartRef = firebase
      .firestore()
      .collection("UserCart")
      .doc(firebase.auth().currentUser.uid);
    cartRef.delete();
    // xoá thành công
    if (!cartRef.get().empty) {
      navigation.navigate("home");
      navigation.navigate("cart");
    }
    console.log("Đặt đơn thành công!");
  };

  const cancleOrder = () => {};

  return (
    <SafeAreaView>
      <ScrollView style={styles.containerout}>
        <TouchableOpacity onPress={() => navigation.navigate("home")}>
          <View style={navbtn}>
            <AntDesign name="back" size={24} color="black" style={navbtnin} />
          </View>
        </TouchableOpacity>
        <View style={styles.container}>
          <Text style={styles.head1}>Đơn hàng của bạn</Text>
          <FlatList
            style={styles.c1}
            data={orderdata.cart}
            renderItem={({ item }) => {
              return (
                <View style={styles.rowout}>
                  <View style={styles.row}>
                    <View style={styles.left}>
                      <Text style={styles.qty}>{item.Foodquantity}</Text>
                      <Text style={styles.title}>* {item.data.foodName}</Text>
                      <Text style={styles.price1}>Đ.{item.data.foodPrice}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.left}>
                      <Image
                        source={{ uri: item.data.foodImageUrl }}
                        style={styles.cartimg}
                      />
                    </View>
                    <View style={styles.mid}>
                      <Text style={styles.qtyTotal}> Tổng giá: </Text>
                    </View>
                    <View style={styles.right}>
                      <Text style={styles.totalprice}>
                        Đ.
                        {parseInt(item.Foodquantity) *
                          parseInt(item.data.foodPrice)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
          <View style={hr80}></View>
          <View style={styles.row}>
            <View style={styles.left}>
              <Text style={styles.title}>Order Total :</Text>
            </View>
            <View style={styles.left}>
              <Text style={styles.totalprice}>Đ.{totalCost}</Text>
            </View>
          </View>

          <View style={hr80}></View>

          <View style={styles.userdataout}>
            <Text style={styles.head1}>Địa chỉ của bạn</Text>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.title}>Tên :</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.title}>{userdata?.name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.title}>Email :</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.title}>{userdata?.email}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.title}>SĐT :</Text>
              </View>

              <View style={styles.right}>
                <Text style={styles.title}>{userdata?.phone}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.left}>
                <Text style={styles.title}>Địa chỉ :</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.title}>{userdata?.address}</Text>
              </View>
            </View>
          </View>

          <View style={hr80}></View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => navigation.navigate("cart")}
            >
              <Text style={styles.btntext}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btntext} onPress={() => placenow()}>
                Đặt
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Placeorder;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
  head1: {
    fontSize: 30,
    fontWeight: "200",
    color: colors.text1,
    margin: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
  },
  rowout: {
    flexDirection: "column",
    margin: 10,
    elevation: 10,
    backgroundColor: colors.col1,
    padding: 10,
    borderRadius: 10,
  },
  qtyTotal: {},
  cartimg: {
    width: 100,
    height: 70,
    borderRadius: 10,
  },
  qty: {
    width: 40,
    height: 30,
    // backgroundColor: colors.text1,
    borderRadius: 10,
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 0,
    color: colors.text1,
    fontSize: 17,
    fontWeight: "bold",
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 10,
  },
  price1: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 10,
    color: colors.text1,
  },
  left: {
    flexDirection: "row",
  },
  right: {
    flexDirection: "row",
  },
  totalprice: {
    fontSize: 16,
    fontWeight: "bold",
    borderColor: colors.text1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
  },
  btntext: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.col1,
    margin: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
  },
  btn: {
    height: 50,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
    marginLeft: 20,
    marginRight: 20,
  },
});
