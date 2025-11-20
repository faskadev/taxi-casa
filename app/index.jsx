import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useStore } from "../stores/useStore";

export default function MainMapScreen() {
  const router = useRouter();
  const { isNightMode, toggleNightMode } = useStore();
  const [taxis, setTaxis] = useState([]);

  useEffect(() => {
    // simulate 6–8 taxis around Casablanca
    const randomTaxis = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      latitude: 33.589886 + (Math.random() - 0.5) * 0.02,
      longitude: -7.603869 + (Math.random() - 0.5) * 0.02,
    }));
    setTaxis(randomTaxis);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 33.589886,
          longitude: -7.603869,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Position utilisateur */}
        <Marker
          coordinate={{ latitude: 33.589886, longitude: -7.603869 }}
          pinColor="blue"
          title="You are here"
        />

        {/* Taxis rouges */}
        {taxis.map((taxi) => (
          <Marker
            key={taxi.id}
            coordinate={{
              latitude: taxi.latitude,
              longitude: taxi.longitude,
            }}
            pinColor="red"
          />
        ))}
      </MapView>

      {/* Overlay simple */}
      <View style={styles.overlay}>
        <View style={styles.row}>
          <Text>Day/Night</Text>
          <Switch value={isNightMode} onValueChange={toggleNightMode} />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/booking")}>
          <Text style={styles.buttonText}>Book a Taxi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
