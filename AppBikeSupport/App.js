//React Native
import { NativeRouter } from "react-router-native";
//Custom components
import Main from "./src/Main";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <NativeRouter>
        <Main />
      </NativeRouter>
    </AuthProvider>
  );
}
