import React, { useState } from "react";
import { LogBox } from "react-native";
const { MyLibrary } = NativeModules;

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useGlobalContext } from "../../context/GlobalProvide";
LogBox.ignoreAllLogs();
const availableCategories = [
  { id: 1, name: "Мебель", color: "#daa0ff" },
  { id: 2, name: "Покупки", color: "#ff84e6" },
  { id: 3, name: "Машина", color: "#ffa99b" },
  { id: 4, name: "Здоровье", color: "#ffe279" },
  { id: 5, name: "Еда", color: "#f2ff8d" },
  { id: 6, name: "Жилье", color: "#08a5ff" },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { balance, updateBalance } = useGlobalContext();

  const totalAmount = categories.reduce(
    (sum, category) => sum + category.amount,
    0
  );

  const pieData = categories.map((category) => ({
    name: category.name,
    amount: category.amount,
    color: category.color,
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
    percentage: ((category.amount / totalAmount) * 100).toFixed(2),
  }));

  const handleAddCategory = () => {
    const newAmount = MyLibrary.calculateAmount(
      currentAmount,
      additionalAmount
    );
    console.log("Новый баланс: ", newAmount);

    if (parseFloat(trimmedAmount) > balance) {
      Alert.alert(
        "Недостаточно средств",
        "У вас недостаточно средств для добавления этой категории."
      );
      return;
    }

    const existingCategory = categories.find(
      (category) => category.name === newCategory.name
    );
    if (existingCategory) {
      existingCategory.amount += parseFloat(trimmedAmount);
      setCategories([...categories]);
    } else {
      setCategories([
        ...categories,
        { ...newCategory, amount: parseFloat(trimmedAmount) },
      ]);
    }

    updateBalance(balance - parseFloat(trimmedAmount));

    setAmount("");
    setNewCategory(null);
    setModalVisible(false);
  };

  const handleResetChart = () => {
    setCategories([]);
  };

  const handleAmountChange = (text) => {
    const regex = /^(0|[1-9]\d*)(\.\d{0,2})?$/; // Регулярное выражение для проверки формата

    if (regex.test(text) || text === "") {
      setAmount(text);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ваши траты</Text>

      {categories.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={pieData}
            width={320}
            height={200}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
          <View style={styles.innerCircle} />
        </View>
      ) : (
        <Text style={styles.noDataText}>
          Пока не добавлено ни одной категории. Добавьте категорию, чтобы
          увидеть диаграмму.{" "}
        </Text>
      )}

      <Text style={styles.balanceText}>
        Баланс карты: ${balance.toFixed(2)}
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryContainer}>
            <View style={styles.categoryRow}>
              <View
                style={[styles.colorCircle, { backgroundColor: item.color }]}
              />
              <Text style={styles.categoryText}>
                {item.name}: ${item.amount} (
                {pieData.find((p) => p.name === item.name).percentage}%)
              </Text>
            </View>
            <View
              style={[
                styles.expenseLine,
                {
                  width: `${
                    pieData.find((p) => p.name === item.name).percentage
                  }%`,
                },
              ]}
            />
          </View>
        )}
        style={styles.categoryList}
        contentContainerStyle={styles.categoryListContent}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Добавить категорию</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={handleResetChart}>
        <Text style={styles.resetButtonText}>Сбросить диаграмму</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Добавить категорию</Text>

              <FlatList
                data={availableCategories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.categoryOption,
                      newCategory && newCategory.id === item.id
                        ? styles.selectedCategory
                        : null,
                    ]}
                    onPress={() => setNewCategory(item)}
                  >
                    <Text style={styles.categoryOptionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />

              <TextInput
                style={styles.input}
                placeholder="Введите сумму"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleAddCategory}
              >
                <Text style={styles.buttonText}>Добавить категорию</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Закрыть</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 25,
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
  },
  balanceText: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  expenseLine: {
    height: 5,
    backgroundColor: "purple",
    borderRadius: 5,
    marginTop: 5,
  },
  addButton: {
    backgroundColor: "#FFA001",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  categoryOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedCategory: {
    backgroundColor: "#f0f0f0",
  },
  categoryOptionText: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#FFA001",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  innerCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    top: "50%",
    left: "50%",
    marginLeft: -103,
    marginTop: -40,
  },
  categoryList: {
    flexGrow: 1,
  },
  categoryListContent: {
    paddingBottom: 20,
  },
  resetButton: {
    backgroundColor: "#d9534f",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Home;
