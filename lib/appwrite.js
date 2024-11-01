import {
  ID,
  Account,
  Avatars,
  Databases,
  Client,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "66fba987000e986a2703",
  databaseId: "66fbaa8c0011ff0cefae",
  userCollectionId: "66fbaaa500391cbcc02c",
  storageId: "66fbabbb003e1b5e347c",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount || !newAccount.$id) {
      throw new Error("Ошибка при создании аккаунта");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password); // Вход после создания аккаунта

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Ошибка создания пользователя:", error);
    throw new Error(error.message || "Не удалось создать пользователя");
  }
};

export async function signIn(email, password) {
  try {
    // Проверяем, есть ли уже активная сессия
    const currentAccount = await getCurrentAccount();
    if (currentAccount) {
      console.log("Пользователь уже авторизован:", currentAccount);
      return currentAccount; // Возвращаем текущий аккаунт
    }

    // Создаем новую сессию для пользователя
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Создана новая сессия:", session);

    // Возвращаем текущий аккаунт
    return await getCurrentAccount();
  } catch (error) {
    console.error("Ошибка входа:", error);
    throw new Error(error.message || "Не удалось войти в систему");
  }
}

export async function getCurrentAccount() {
  try {
    return await account.get();
  } catch (error) {
    console.log("Сессия отсутствует:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getCurrentAccount();
    if (!currentAccount) throw new Error("Нет активной сессии");

    // Поиск пользователя в базе данных по accountId
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    // Если пользователь не найден в базе данных
    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("Пользователь не найден в базе данных");
    }

    return currentUser.documents[0]; // Возвращаем данные пользователя
  } catch (error) {
    console.error("Ошибка получения текущего пользователя:", error);
    return null;
  }
}

export async function logout() {
  try {
    const currentAccount = await getCurrentAccount();
    if (currentAccount) {
      await account.deleteSession("current");
      console.log("Пользователь вышел из системы.");
    }
  } catch (error) {
    console.error("Ошибка выхода:", error);
    throw new Error(error.message || "Не удалось выйти из системы");
  }
}
