import { FlatList, StyleSheet, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useStore } from "../stores/useStore";

export default function HistoryScreen() {
  const { history, deleteRide } = useStore();

  const totalSpent = history.reduce((sum, r) => sum + Number(r.price || 0), 0);

  const renderRightActions = (id) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => deleteRide(id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride History</Text>
      <Text style={styles.stats}>
        Total Rides: {history.length} | Total Spent: {totalSpent.toFixed(2)} DH
      </Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.route}>
                  {item.departure} → {item.destination}
                </Text>
                <Text>
                  {item.distance.toFixed(2)} km | {item.time} min | {item.mode}
                </Text>
                <Text style={styles.price}>{item.price} DH</Text>
              </View>
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  stats: { marginBottom: 10, fontWeight: "500" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  route: { fontWeight: "bold" },
  price: { fontWeight: "bold", color: "green" },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 8,
    marginVertical: 8,
  },
  deleteText: { color: "white", fontWeight: "bold" },
});
