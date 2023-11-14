import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const loginUser = (data) => {
    setIsLoading(true);
    setUserToken(data.token);
    setUserInfo(data.user);
    AsyncStorage.setItem("userToken", data.token);
    AsyncStorage.setItem("userInfo", JSON.stringify(data.user));
    setIsLoading(false);
  };

  const updateUser = (data) => {
    setIsLoading(true);
    setUserInfo(data);
    AsyncStorage.setItem("userInfo", JSON.stringify(data));
    setIsLoading(false);
  };

  const logoutUser = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userInfo");
    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem("userToken");
      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserToken(userToken);
        setUserInfo(userInfo);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Logged in function error: " + error);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userToken, userInfo, isLoading, loginUser, logoutUser, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
