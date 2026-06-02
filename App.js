import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";
import { ThemeProvider } from "./app/context/ThemeContext";

import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
      <Toast />
    </ThemeProvider>
  );
}

// Ensure the root component is registered correctly
registerRootComponent(App);
