import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import axios, { AxiosError } from 'axios'; 
import Constants from 'expo-constants';
import { BackgroundGradient } from '@/components/BackgroundGradient';

export default function RegisterScreen() {
  const [userType, setUserType] = useState<'elderly' | 'caretaker'>('elderly'); // Type userType
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState(''); // For Elderly
  const [password, setPassword] = useState(''); // For Caretaker
  const [certification, setCertification] = useState(''); // For Caretaker
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      setLoading(false);
      return;
    }
    if (!phoneNumber.match(/^\d{10}$/)) {
      Alert.alert('Error', 'Phone Number must be 10 digits');
      setLoading(false);
      return;
    }
    if (userType === 'elderly' && pin.length !== 4) {
      Alert.alert('Error', 'PIN must be exactly 4 digits');
      setLoading(false);
      return;
    }
    if (userType === 'caretaker' && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = {
        name,
        phone_number: phoneNumber,
        password: userType === 'elderly' ? pin : password,
        role: userType,
        ...(userType === 'caretaker' && certification && { certification }),
      };

      console.log('API URL:', `${Constants.expoConfig?.extra?.apiUrl}/authentication/register/`);
      console.log('Request Data:', data);

      const response = await axios.post(
      'http://192.168.1.75:8000/authentication/register/',  // Use explicit IP
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );



    if (response.status === 201 || response.status === 200) {
      // Success: Clear form and redirect to login
        Alert.alert('Success', 'Registration successful! Please log in.');
        setName('');
        setPhoneNumber('');
        setPin('');
        setPassword('');
        setCertification('');
        router.push('/login');
      } else {
        // Failure: Throw error for catch block
        throw new Error(response.data.errors || 'Registration failed');
      }
    } catch (error) {
      // Handle Axios error
      let message = 'Something went wrong';
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ errors?: Record<string, string[]> }>;
        message =
          axiosError.response?.data?.errors?.phone_number?.[0] ||
          axiosError.response?.data?.errors?.non_field_errors?.[0] ||
          axiosError.message ||
          message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <BackgroundGradient />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="px-5">
          <View className="items-center mb-6">
            <Image
              source={require('../../assets/images/adaptive-icon.png')}
              className="w-24 h-24"
              resizeMode="contain"
            />
          </View>

          <Text className="text-3xl font-bold text-slate-800 text-center mb-6">
            Register
          </Text>

          {/* User Type Buttons at the Top */}
          <View className="flex-row justify-between mb-6 w-full">
            <TouchableOpacity
              className={`flex-1 p-4 rounded-lg border mr-2 ${
                userType === 'elderly' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onPress={() => setUserType('elderly')}
              accessibilityLabel="Select Elderly"
            >
              <Text className="text-lg text-center font-medium">Elderly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-4 rounded-lg border ${
                userType === 'caretaker' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onPress={() => setUserType('caretaker')}
              accessibilityLabel="Select Caretaker"
            >
              <Text className="text-lg text-center font-medium">Caretaker</Text>
            </TouchableOpacity>
          </View>

          {/* Name Input */}
          <TextInput
            className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor="#999"
            accessibilityLabel="Name Input"
          />

          {/* Phone Number Input */}
          <TextInput
            className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            accessibilityLabel="Phone Number Input"
          />

          {/* Conditional Fields */}
          {userType === 'elderly' ? (
            <TextInput
              className="bg-white p-4 rounded-lg mb-6 border border-gray-300 text-lg w-full shadow-sm"
              placeholder="4-Digit PIN"
              value={pin}
              onChangeText={(text) => {
                // Restrict to 4 digits
                if (text.length <= 4 && /^\d*$/.test(text)) {
                  setPin(text);
                }
              }}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#999"
              accessibilityLabel="PIN Input"
            />
          ) : (
            <>
              <TextInput
                className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
                accessibilityLabel="Password Input"
              />
              <TextInput
                className="bg-white p-4 rounded-lg mb-6 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="Caretaker Certification (Optional)"
                value={certification}
                onChangeText={setCertification}
                placeholderTextColor="#999"
                accessibilityLabel="Certification Input"
              />
            </>
          )}

          {/* Register Button */}
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

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-base text-gray-500 mr-1">Already have an account?</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-base font-bold text-blue-500">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}