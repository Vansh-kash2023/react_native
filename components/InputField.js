import { TextInput } from 'react-native';
import { View } from 'react-native';
import { tw } from 'nativewind';

const InputField = ({ placeholder, value, setValue, secureTextEntry }) => {
  return (
    <View style={tw`mb-4`}>
      <TextInput
        style={tw`border p-3 rounded-lg bg-gray-100`}
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

export default InputField;
