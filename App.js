import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./app/navigation/AuthNavigator";

export default function App() {
  return <NavigationContainer><AuthNavigator /></NavigationContainer>;
}

// Ensure the root component is registered correctly
registerRootComponent(App);
