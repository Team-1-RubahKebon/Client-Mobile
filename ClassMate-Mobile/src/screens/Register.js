import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import { register } from "../stores/action/actionCreatorUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import classmateKecil from "../../assets/classmate-kecil.png";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";


export default function Login() {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const fetchClass = async () => {
    const { data } = await axios.get("http://localhost:3000/students/class");
    setListClass(data);
  };

  const [listClass, setListClass] = useState([]);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [kelas, setKelas] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchClass();
  }, []);

  const screenWidth = Dimensions.get("window").width;
  const aspectRatio = 0.15;
  const newHeight = screenWidth * aspectRatio;

  const submitRegister = async () => {
    try {
      const input = { email, name, password, ClassId: kelas, address };
      const data = await dispatch(register(input));
      setEmail("");
      setName("");
      setAddress("");
      setKelas("");
      setPassword("");
      setListClass([]);
      if (data.access_token) {
        console.log(data.access_token);
        await AsyncStorage.setItem("access_token", data.access_token);
        navigation.push("Home");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <View style={[styles.container]}>
      {/* <Image
        source={classmateKecil}
        style={{
          width: screenWidth,
          height: newHeight,
          alignSelf: "center",
          marginBottom: 20,
        }}
      /> */}
       <View style={{justifyContent:'center', alignItems :'center',marginTop:30, marginBottom:20}} >
          <Image source={require('../../assets/Classmate.png')} style={{height:150, width:150}}/>
        </View>
      <SafeAreaView style={styles.formContainer}>
        <TextInput
          name="name"
          style={styles.input}
          onChangeText={setName}
          placeholder="input name"
          value={name}
        />
        <View style={styles.input} >
            <Text><Icon name={'envelope'} size={30} color={"#bdbdbd"} style={{elevation:5}} /></Text>
            <TextInput
            style={{marginHorizontal:20, elevation:5}}
              keyboardType="email-address"
              name="email"
              onChangeText={setEmail}
              placeholder="input email"
              value={email}
              />
          </View>
        <TextInput
          name="password"
          style={styles.input}
          onChangeText={setPassword}
          placeholder="input password"
          keyboardType="numeric"
          value={password}
        />
        <TextInput
          name="address"
          style={styles.input}
          onChangeText={setAddress}
          placeholder="input address"
          value={address}
        />
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <SelectDropdown
            defaultButtonText="Choose Class"
            dropdownStyle={{ borderColor: "red" }}
            data={listClass}
            onSelect={({ name, _id }) => {
              setKelas(_id);
            }}
            buttonTextAfterSelection={({ name }) => {
              return name;
            }}
            rowTextForSelection={({ name }) => {
              return name;
            }}
          />
        </View>
      </SafeAreaView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => submitRegister()}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity >
        <Text onPress={() => navigation.goBack()} style={styles.backButtonText}>
          Back
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#FCFFE7",
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 0.75, 
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
  },
  input: {
    flexDirection:"row",
    borderRadius:15,
    height: 50,
    borderColor:"green",
    borderWidth: 2,
    padding: 10,
    marginTop:20,
    marginHorizontal:10
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  registerButton: {
    backgroundColor: "blue",
    paddingVertical: 14,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
  },
  registerButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    backgroundColor: "blue",
    paddingVertical: 14,
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
  },
});
