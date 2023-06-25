import Toast, { BaseToast } from "react-native-toast-message";

const Notification = () => {
  const toastConfig = {
    /* 
          overwrite 'success' type, 
          modifying the existing `BaseToast` component
        */
    success: ({ text1, props, ...rest }) => (
      <BaseToast
        {...rest}
        style={{ borderLeftColor: "pink" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "400",
        }}
        text1={text1}
        text2={props.uuid}
      />
    ),

    /* 
          or create a completely new type - `my_custom_type`,
          building the layout from scratch
        */
    my_custom_type: ({ text1, props, ...rest }) => (
      <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
        <Text>{text1}</Text>
      </View>
    ),
  };
  return (
    <>
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
    </>
  );
};

export default Notification;

// const styles = StyleSheet.create({});
