import { View, Text, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { icons } from "../../constants";
import Home from "../(tabs)/home";
import Bookmark from "../(tabs)/bookmark";
import Create from "../(tabs)/create";
import Profile from "../(tabs)/profile";

const TabIcon = ({ icon, color, name, focused }) => (
  <View style={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
    <Image
      source={icon}
      resizeMode="contain"
      tintColor={color}
      className="w-6 h-6"
    />
    <Text
      style={{
        color: color,
        fontSize: 12,
        fontWeight: focused ? "600" : "400",
      }}
    >
      {name}
    </Text>
  </View>
);

const MaterialTopTabs = createMaterialTopTabNavigator();

const TabsLayout = () => {
  return (
    <MaterialTopTabs.Navigator
      swipeEnabled
      tabBarOptions={{
        showIcon: true,
        activeTintColor: "#FFA001",
        inactiveTintColor: "#CDCDE0",
        style: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 80,
        },
      }}
    >
      <MaterialTopTabs.Screen
        name="Дом"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.home} color={color} focused={focused} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="История"
        component={Bookmark}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.bookmark} color={color} focused={focused} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="Создание"
        component={Create}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.plus} color={color} focused={focused} />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="Профиль"
        component={Profile}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={icons.profile} color={color} focused={focused} />
          ),
        }}
      />
    </MaterialTopTabs.Navigator>
  );
};

export default TabsLayout;
