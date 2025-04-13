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
  const [userType, setUserType] = useState<'elderly' | 'caretaker'>('elderly'); 
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // For elderly user login/pin
  const [pin, setPin] = useState(''); 
  
  // For caretaker's own account
  const [password, setPassword] = useState(''); 
  const [certification, setCertification] = useState(''); // Optional field for caretaker

  // For caretaker: elderly user details
  const [elderlyName, setElderlyName] = useState('');
  const [elderlyPhone, setElderlyPhone] = useState('');
  const [elderlyPin, setElderlyPin] = useState('');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    // Basic validations for shared fields
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required for your account');
      return;
    }
    if (!phoneNumber.match(/^\d{10}$/)) {
      Alert.alert('Error', 'Your phone number must be 10 digits');
      return;
    }

    if (userType === 'elderly') {
      if (pin.length !== 4) {
        Alert.alert('Error', 'PIN must be exactly 4 digits for elderly');
        return;
      }
    } else if (userType === 'caretaker') {
      // Validate caretaker's account fields
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters for caretaker');
        return;
      }
      // Validate nested elderly details
      if (!elderlyName.trim()) {
        Alert.alert('Error', 'Elderly name is required');
        return;
      }
      if (!elderlyPhone.match(/^\d{10}$/)) {
        Alert.alert('Error', 'Elderly phone number must be 10 digits');
        return;
      }
      if (elderlyPin.length !== 4) {
        Alert.alert('Error', 'Elderly PIN must be exactly 4 digits');
        return;
      }
      // Prevent caretaker and elderly from using the same phone number
      if (phoneNumber === elderlyPhone) {
        Alert.alert('Error', 'Caretaker and elderly cannot have the same phone number');
        return;
      }
    }

    setLoading(true);
    try {
      // Build the request payload according to user type
      let data: any = {
        name,
        phone_number: phoneNumber,
        role: userType,
      };

      if (userType === 'elderly') {
        data.password = pin;
      } else if (userType === 'caretaker') {
        data.password = password;
        // Optionally add certification if provided
        if (certification.trim()) {
          data.certification = certification;
        }
        // Nest elderly user details into the payload
        data.elderly_user = {
          name: elderlyName,
          phone_number: elderlyPhone,
          password: elderlyPin,
        };
      }

      const apiUrl = `${Constants.expoConfig?.extra?.apiUrl || 'http://192.168.1.91:8000'}/authentication/register/`;
      console.log('API URL:', apiUrl);
      console.log('Request Data:', data);

      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Registration successful! Please log in.');
        // Clear form fields on success
        setName('');
        setPhoneNumber('');
        setPin('');
        setPassword('');
        setCertification('');
        setElderlyName('');
        setElderlyPhone('');
        setElderlyPin('');
        router.push('/login');
      } else {
        throw new Error(response.data.errors || 'Registration failed');
      }
    } catch (error: any) {
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

          {/* User Type Buttons */}
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

          {/* Caretaker and Elderly Shared Fields */}
          <TextInput
            className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor="#999"
            accessibilityLabel="Name Input"
          />

          <TextInput
            className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            accessibilityLabel="Phone Number Input"
          />

          {userType === 'elderly' ? (
            <>
              <TextInput
                className="bg-white p-4 rounded-lg mb-6 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="4-Digit PIN"
                value={pin}
                onChangeText={(text) => {
                  if (text.length <= 4 && /^\d*$/.test(text)) {
                    setPin(text);
                  }
                }}
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor="#999"
                accessibilityLabel="PIN Input"
              />
            </>
          ) : (
            <>
              {/* Caretaker's Own Credentials */}
              <TextInput
                className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="Password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
                accessibilityLabel="Password Input"
              />
              <TextInput
                className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="Caretaker Certification (Optional)"
                value={certification}
                onChangeText={setCertification}
                placeholderTextColor="#999"
                accessibilityLabel="Certification Input"
              />

              {/* Nested Elderly User Details */}
              <Text className="text-lg font-bold text-slate-800 mb-2">Elderly User Details</Text>
              <TextInput
                className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="Elderly Name"
                value={elderlyName}
                onChangeText={setElderlyName}
                autoCapitalize="words"
                placeholderTextColor="#999"
                accessibilityLabel="Elderly Name Input"
              />
              <TextInput
                className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="Elderly Phone Number"
                value={elderlyPhone}
                onChangeText={setElderlyPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                accessibilityLabel="Elderly Phone Input"
              />
              <TextInput
                className="bg-white p-4 rounded-lg mb-6 border border-gray-300 text-lg w-full shadow-sm"
                placeholder="4-Digit Elderly PIN"
                value={elderlyPin}
                onChangeText={(text) => {
                  if (text.length <= 4 && /^\d*$/.test(text)) {
                    setElderlyPin(text);
                  }
                }}
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor="#999"
                accessibilityLabel="Elderly PIN Input"
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
