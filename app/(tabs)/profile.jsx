import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import { useGlobalContext } from "../../context/GlobalProvide";

const Profile = () => {
  const { addBalance, resetBalance, balance } = useGlobalContext();
  const [amount, setAmount] = useState("");
  const [isPortrait, setIsPortrait] = useState(true);

  const handleOrientationChange = () => {
    const { width, height } = Dimensions.get("window");
    setIsPortrait(height >= width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );
    handleOrientationChange();

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAddAmount = () => {
    const trimmedAmount = amount.trim();

    if (
      isNaN(trimmedAmount) ||
      trimmedAmount === "" ||
      trimmedAmount < 0 ||
      trimmedAmount > 1000000000 ||
      trimmedAmount === "0"
    ) {
      Alert.alert("Неверный ввод", "Введите допустимую сумму.");
      return;
    }

    addBalance(parseFloat(trimmedAmount));
    setAmount("");
  };

  const handleResetBalance = () => {
    resetBalance();
    Alert.alert("Сброс баланса", "Ваш баланс был сброшен до $0.00");
  };

  const handleAmountChange = (text) => {
    const regex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;

    if (regex.test(text) || text === "") {
      setAmount(text);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        isPortrait ? styles.portrait : styles.landscape,
      ]}
    >
      <Text style={styles.title}>Профиль</Text>

      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Ваша карта</Text>
          <Text style={styles.balance}>Баланс: ${balance.toFixed(2)}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Введите значение"
          keyboardType="numeric"
          value={amount}
          onChangeText={handleAmountChange}
        />

        <View style={styles.buttonContainer}>
          <Button title="Добавить значение" onPress={handleAddAmount} />
          <Button
            title="Сбросить баланс"
            onPress={handleResetBalance}
            color="red"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  portrait: {
    flexDirection: "column",
  },
  landscape: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    borderWidth: 2,
    borderColor: "#FFA001",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 18,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
});
