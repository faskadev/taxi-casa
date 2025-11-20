import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useStore } from "../stores/useStore";
import { Picker } from '@react-native-picker/picker';

export default function BookingScreen() {
  const router = useRouter();
  const { isNightMode, startRide } = useStore();

  const neighborhoods = [
    "Maarif", "Derb Omar", "Ain Diab", "Sidi Bernoussi", "Hay Hassani",
    "Oasis", "Anfa", "Bourgogne", "Mers Sultan", "Ain Sebaa"
  ];

  const popularPlaces = [
    "Aéroport Mohammed V",
    "Gare Casa-Voyageurs",
    "Morocco Mall",
    "Twin Center",
    "Marina de Casablanca",
    "Mosquée Hassan II",
    "Quartier des Habous",
    "Ain Diab",
    "Boulevard Zerktouni",
    "Marché Central",
  ];

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(null);

  const calculateRide = () => {
    if (departure && destination) {
      // Simulation simple: distance aléatoire
      const d = Math.random() * 15 + 1; // 1 à 16 km
      setDistance(d);
    }
  };

  const base = 7.5;
  const perKm = isNightMode ? 2.0 : 1.5;
  const price = distance ? (base + perKm * distance).toFixed(2) : "-";
  const time = distance ? Math.round((distance / 30) * 60) : "-"; // vitesse moyenne 30 km/h

  const confirm = () => {
    if (!distance) return;
    const ride = {
      id: Date.now(),
      departure,
      destination,
      distance,
      price,
      time,
      mode: isNightMode ? "Night" : "Day",
    };
    startRide(ride);
    router.push("/ride"); // écran course en cours
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book your Taxi</Text>

      <Text>Departure:</Text>
      <Picker selectedValue={departure} onValueChange={setDeparture}>
        <Picker.Item label="Select departure" value="" />
        {neighborhoods.map((n) => (
          <Picker.Item label={n} value={n} key={n} />
        ))}
      </Picker>

      <Text>Destination:</Text>
      <Picker selectedValue={destination} onValueChange={setDestination}>
        <Picker.Item label="Select destination" value="" />
        {popularPlaces.map((p) => (
          <Picker.Item label={p} value={p} key={p} />
        ))}
      </Picker>

      <Button title="Calculate" onPress={calculateRide} />

      {distance && (
        <View style={styles.infoBox}>
          <Text>Distance: {distance.toFixed(2)} km</Text>
          <Text>Estimated Price: {price} DH</Text>
          <Text>Estimated Time: {time} min</Text>
        </View>
      )}

      <Button title="Confirm Booking" onPress={confirm} disabled={!distance} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  infoBox: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
});