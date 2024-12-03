import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, Text, View, Image, Dimensions } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "./components/CustomButton";
import { useGlobalContext } from "../context/GlobalProvide";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();
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

    return () => subscription?.remove();
  }, []);

  if (!isLoading && isLoggedIn) return <Redirect href="/home" />;

  const renderHeader = () => (
    <View className="w-full items-center justify-center min-h-[85vh] px-4">
      <Image
        source={images.logo}
        className="w-[130px] h-[84px]"
        resizeMode="contain"
      />

      <View className="relative mt-5">
        <Text className="text-3xl text-white font-bold text-center">
          Откройте для себя бесконечные возможности с{" "}
          <Text className="text-secondary-200">Aora</Text>
        </Text>
      </View>
      <Text className="text-sm text-gray-100 font-pregular mt-7 text-center">
        Ваши финансовые цели становятся реальностью благодаря продуманным
        решениям и эффективному управлению ресурсами
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View
            style={{ width: "100%", paddingHorizontal: 20, marginBottom: 20 }}
          >
            <CustomButton
              title="Продолжить с почтой"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mb-7 pl-6 pr-6"
            />
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20,
        }}
      />
      <StatusBar hidden={true} backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
