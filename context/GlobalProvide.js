import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const addBalance = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  const deductBalance = (amount) => {
    setBalance((prevBalance) => Math.max(prevBalance - amount, 0));
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const resetBalance = () => {
    setBalance(0); // Обнуление баланса
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        balance,
        addBalance,
        deductBalance,
        updateBalance, // Функция для обновления баланса
        resetBalance, // Добавляем функцию обнуления баланса
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default GlobalProvider;
