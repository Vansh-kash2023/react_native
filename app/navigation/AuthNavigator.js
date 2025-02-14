import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import HomeScreen from "../screens/HomeScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import CognitiveAssessment from "../screens/CognitiveAssessmentScreen"
import Profile from "../screens/ProfileScreen"
import RoutineReminder from "../screens/RoutineReminderScreen"
import LifeTimeline from "../screens/LifeTimeline"

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen name="CognitiveAssessment" component={CognitiveAssessment} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="RoutineReminder" component={RoutineReminder} />
      <Stack.Screen name="Timeline" component={LifeTimeline} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
