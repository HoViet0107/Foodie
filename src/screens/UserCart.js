import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { btn2, colors, hr80, navbtn, navbtnin } from "../globals/style";
import { AntDesign } from "@expo/vector-icons";
import { firebase } from "../../Firebase/firebaseConfig";
import BottomNav from "../components/BottomNav";
import { SafeAreaView } from "react-native";

const UserCart = ({ navigation }) => {
  const [cartdata, setCartdata] = useState(null);
  const [totalCost, setTotalCost] = useState("0");

  const getcartdata = async () => {
    const docRef = firebase
      .firestore()
      .collection("UserCart")
      .doc(firebase.auth().currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        const data = JSON.stringify(doc.data());
        setCartdata(data);
      } else {
        return <View></View>;
      }
    });
  };

  useEffect(() => {
    getcartdata();
  }, []);

  useEffect(() => {
    if (cartdata != null) {
      const foodprice = JSON.parse(cartdata).cart;
      let totalfoodprice = 0;
      foodprice.map((item) => {
        // console.log(item.data.foodPrice)
        totalfoodprice =
          parseInt(item.data.foodPrice) * parseInt(item.Foodquantity) +
          totalfoodprice;
      });
      // parseInt(item.data.foodAddonPrice) * parseInt(item.Addonquantity) +
      // console.log(totalfoodprice)
      setTotalCost(JSON.stringify(totalfoodprice));
    }
  }, [cartdata]);
  // console.log(cartdata)

  // console.log(JSON.parse(cartdata).cart[0].data);

  const deleteItem = (item) => {
    const docRef = firebase
      .firestore()
      .collection("UserCart")
      .doc(firebase.auth().currentUser.uid);
    docRef.update({
      cart: firebase.firestore.FieldValue.arrayRemove(item),
    });
    getcartdata();
  };

  // console.log(typeof (cartdata))
  // console.log(cartdata)
  return (
    <SafeAreaView style={styles.containerout}>
      <TouchableOpacity onPress={() => navigation.navigate("home")}>
        <View style={navbtn}>
          <AntDesign name="back" size={24} color="black" style={navbtnin} />
        </View>
      </TouchableOpacity>

      <View style={styles.bottomnav}>
        <BottomNav navigation={navigation} />
      </View>
      <View style={styles.container}>
        <Text style={styles.head1}>Giỏ hàng</Text>
        <View style={styles.cartout}>
          {cartdata == null || JSON.parse(cartdata).cart.length == 0 ? (
            <Text style={styles.head2}>Giỏ hàng trống!</Text>
          ) : (
            <FlatList
              style={styles.cardlist}
              data={JSON.parse(cartdata).cart}
              renderItem={({ item }) => {
                return (
                  <View style={styles.cartcard}>
                    <Image
                      source={{ uri: item.data.foodImageUrl }}
                      style={styles.cartimg}
                    />
                    <View style={styles.cartcardin}>
                      <View style={styles.c1}>
                        <Text style={styles.txt1}>
                          {item.Foodquantity}&nbsp;{item.data.foodName}
                        </Text>
                        <Text style={styles.txt2}>
                          *Đ.{item.data.foodPrice}
                        </Text>
                      </View>
                      {/* {item.Addonquantity > 0 && (
                        <View style={styles.c2}>
                          <Text style={styles.txt3}>
                            {item.Addonquantity}&nbsp;{item.data.foodAddon}
                          </Text>
                          <Text style={styles.txt3}>
                            *Đ.{item.data.foodAddonPrice}
                          </Text>
                        </View>
                      )} */}
                      <TouchableOpacity
                        style={styles.c4}
                        onPress={() => deleteItem(item)}
                      >
                        <Text style={styles.txt1}>Xoá</Text>
                        <AntDesign
                          name="delete"
                          size={24}
                          color="black"
                          style={styles.del}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
        <View style={styles.btncont}>
          <View style={styles.c3}>
            <Text style={styles.txt5}>Tổng</Text>
            <Text style={styles.txt6}>Đ.{totalCost}</Text>
          </View>
          {cartdata == null || JSON.parse(cartdata).cart.length == 0 ? (
            <TouchableOpacity disabled={true} style={styles.btnthanhtoan}>
              <Text style={styles.btntxt}>Thanh toán</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={false} style={btn2}>
              <Text
                style={styles.btntxt}
                onPress={() => navigation.navigate("placeorder", { cartdata })}
              >
                Thanh toán
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserCart;

const styles = StyleSheet.create({
  containerout: {
    flex: 1,
    backgroundColor: colors.col1,
    // alignItems: 'center',
    width: "100%",
    // height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.col1,
    // alignItems: 'center',
    // justifyContent: 'center',
    width: "100%",
    // height: '100%',
  },
  head1: {
    fontSize: 40,
    textAlign: "center",
    // fontWeight: '200',
    // marginVertical: 20,
    color: colors.text1,
  },
  head2: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "200",
    marginVertical: 20,
    elevation: 10,
    backgroundColor: colors.col1,
    width: "90%",
    height: "50%",
    alignSelf: "center",
    paddingVertical: "25%",
    borderRadius: 10,
  },
  cartcard: {
    flexDirection: "row",
    backgroundColor: colors.col1,
    marginVertical: 5,
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
    elevation: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.25,
  },
  cartimg: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  cartcardin: {
    flexDirection: "column",
    margin: 5,
    width: "58%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.text1,
  },
  cardlist: {
    width: "100%",
  },
  cartout: {
    flex: 1,
    width: "100%",
  },
  btntxt: {
    // backgroundColor: colors.text1,
    color: colors.col1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 20,
    borderRadius: 10,
    width: "90%",
    textAlign: "center",
  },
  btncont: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    flexDirection: "row",
    marginBottom: 80,
    borderTopColor: colors.text3,
    borderTopWidth: 0.2,
  },
  bottomnav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: colors.col1,
    zIndex: 20,
  },
  c1: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // width: "100%",
    backgroundColor: colors.col1,
    // borderRadius: 10,
    padding: 5,
    overflow: "hidden",
    alignItems: "center",
  },
  txt1: {
    fontSize: 16,
    color: colors.text1,
    width: "auto",
    fontWeight: "bold",
  },
  txt2: {
    fontSize: 16,
    color: colors.text3,
    fontWeight: "bold",
    width: "auto",
  },
  c2: {
    backgroundColor: colors.text1,
    borderRadius: 10,
    width: "auto",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    flexDirection: "row",
  },
  txt3: {
    fontSize: 15,
    color: colors.col1,
  },
  txt5: {
    fontSize: 20,
    color: colors.text3,
    marginHorizontal: 5,
  },
  txt6: {
    fontSize: 25,
    color: colors.text3,
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  c3: {
    flexDirection: "row",
    alignItems: "center",
  },
  c4: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 10,
    borderColor: colors.text1,
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
  },
  del: {
    color: colors.text1,
  },
  btnthanhtoan: {
    width: 150,
    height: 50,
    backgroundColor: "grey",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    color: "white",
    margin: 10,
    alignSelf: "center",
  },
});
