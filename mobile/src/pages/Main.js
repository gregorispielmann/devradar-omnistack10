import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import api from "../services/api";

export default function Main({ navigation }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState("");

  function handleRegionChange(region) {
    setCurrentRegion(region);
  }

  useEffect(() => {
    async function loadDevsInitial() {
      const res = await api.get("/devs");

      setDevs(res.data);
    }

    loadDevsInitial();
  }, []);

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;

    const res = await api.get("/search", {
      params: { latitude, longitude, techs }
    });

    setDevs(res.data);
  }

  useEffect(() => {
    async function loadInitialLocation() {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync();

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    }

    loadInitialLocation();
  }, []);

  if (!currentRegion) return null;
  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChange}
        initialRegion={currentRegion}
        style={styles.map}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[1],
              longitude: dev.location.coordinates[0]
            }}
          >
            <Image
              style={styles.avatar}
              source={{
                uri: dev.avatar_url
              }}
            ></Image>

            <Callout
              onPress={() => {
                navigation.navigate("Profile", {
                  github_username: dev.github_username
                });
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          onChangeText={setTechs}
          value={techs}
        ></TextInput>

        <TouchableOpacity style={styles.loadButton} onPress={loadDevs}>
          <MaterialIcons
            name="my-location"
            size={20}
            color="#fff"
          ></MaterialIcons>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    height: 55,
    width: 55,
    borderRadius: 4,
    borderColor: "#fff",
    borderWidth: 4
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16
  },
  devBio: {
    color: "#666",
    marginTop: 6
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#Fff",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 4
  },
  loadButton: {
    height: 50,
    width: 50,
    backgroundColor: "#7d40e7",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    marginLeft: 15
  }
});
