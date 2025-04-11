import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import { Link } from 'expo-router';
import { BackgroundGradient } from '@/components/BackgroundGradient';

export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('elderly'); // Default to 'elderly'
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log('Registration attempt with:', { phoneNumber, password, userType });
      // Add your registration logic here later (e.g., API call)
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <BackgroundGradient />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-5"
      >
        <View className="items-center mb-8">
          <Image
            source={require('../../assets/images/adaptive-icon.png')}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold text-slate-800 text-center mb-8">
          Register
        </Text>

        <TextInput
          className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          accessibilityLabel="Phone Number Input"
        />

        <TextInput
          className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
          accessibilityLabel="Password Input"
        />
{/* 
        <View className="bg-white p-2 rounded-lg mb-6 border border-gray-300 w-full shadow-sm">
          <Picker
            selectedValue={userType}
            onValueChange={(itemValue) => setUserType(itemValue)}
            style={{ height: 50, width: '100%' }}
            accessibilityLabel="User Type Selector"
          >
            <Picker.Item label="Elderly" value="elderly" />
            <Picker.Item label="Caretaker" value="caretaker" />
          </Picker>
        </View> */}

        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-4 px-10 w-full items-center mb-5 shadow-md"
          onPress={handleRegister}
          disabled={loading}
          accessibilityLabel="Register Button"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-bold text-white">Register</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-base text-gray-500 mr-1">Already have an account?</Text>
          <Link href="/(tabs)/login" asChild>
            <TouchableOpacity>
              <Text className="text-base font-bold text-blue-500">Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}