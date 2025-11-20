import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useStore } from "../stores/useStore";

export default function RideScreen() {
  const router = useRouter();
  const { activeRide, endRide, isNightMode } = useStore();
  const [progress, setProgress] = useState(0);
  const [price, setPrice] = useState(Number(activeRide?.price || 0));

  useEffect(() => {
    if (!activeRide) return;
    // Simulate taxi movement
    const interval = setInterval(() => {
      setProgress((p) => (p >= 1 ? 1 : p + 0.01));
    }, 500);

    // Simulate live price increment
    const priceInterval = setInterval(() => {
      setPrice((prev) => prev + 0.2);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(priceInterval);
    };
  }, []);

  if (!activeRide) {
    return (
      <View style={styles.center}>
        <Text>No active ride.</Text>
        <Button title="Go back" onPress={() => router.push("/")} />
      </View>
    );
  }

  // Coordinates simulées pour la course
  const start = { latitude: 33.589886, longitude: -7.603869 };
  const end = { latitude: 33.589886 + 0.02, longitude: -7.603869 + 0.02 };

  const taxiPosition = {
    latitude: start.latitude + (end.latitude - start.latitude) * progress,
    longitude: start.longitude + (end.longitude - start.longitude) * progress,
  };

  const driver = {
    name: "Abdelkader",
    rating: 4.8,
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: taxiPosition.latitude,
          longitude: taxiPosition.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Polyline coordinates={[start, end]} strokeColor="blue" strokeWidth={3} />
        <Marker coordinate={taxiPosition} pinColor="red" title="Taxi" />
        <Marker coordinate={end} pinColor="green" title="Destination" />
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.driverBox}>
          <Image source={{ uri: driver.image }} style={styles.driverImage} />
          <View>
            <Text style={styles.driverName}>{driver.name}</Text>
            <Text>⭐ {driver.rating}</Text>
          </View>
        </View>

        <Text>Mode: {isNightMode ? "Night" : "Day"}</Text>
        <Text>Distance: {activeRide.distance.toFixed(2)} km</Text>
        <Text style={styles.price}>Current Price: {price.toFixed(2)} DH</Text>

        <Button
          title="Cancel Ride"
          color="red"
          onPress={() => {
            endRide();
            router.push("/");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  driverBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  driverImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  driverName: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
