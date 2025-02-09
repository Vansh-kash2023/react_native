import { TouchableOpacity, Text } from 'react-native';
import { tw } from 'nativewind';

const Button = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-blue-500 py-3 rounded-lg`}
    >
      <Text style={tw`text-white text-center text-lg`}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
