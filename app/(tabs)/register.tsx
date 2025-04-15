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
import { globalConfig } from '@/global-config';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [certification, setCertification] = useState('');
  
  // Elderly user details
  const [elderlyName, setElderlyName] = useState('');
  const [elderlyPhone, setElderlyPhone] = useState('');
  const [elderlyPin, setElderlyPin] = useState('');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required for your account');
      return;
    }
    if (!phoneNumber.match(/^\d{10}$/)) {
      Alert.alert('Error', 'Your phone number must be 10 digits');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
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
    if (phoneNumber === elderlyPhone) {
      Alert.alert('Error', 'Caretaker and elderly cannot have the same phone number');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name,
        phone_number: phoneNumber,
        password,
        role: 'caretaker',
        certification: certification.trim() || undefined,
        elderly_user: {
          name: elderlyName,
          phone_number: elderlyPhone,
          password: elderlyPin,
        }
      };

      const apiUrl = `${globalConfig.api.baseUrl}/authentication/register/`;
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Registration successful! Please log in.');
        setName('');
        setPhoneNumber('');
        setPassword('');
        setCertification('');
        setElderlyName('');
        setElderlyPhone('');
        setElderlyPin('');
        router.push('/login');
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

          <Text className="text-2xl font-bold text-slate-800 text-center mb-4">
            Register as Caretaker
          </Text>

          <Text className="text-base font-bold text-slate-800 mb-2">Your Details</Text>
          <TextInput
            className="bg-white p-3 rounded-lg mb-2 border border-gray-300 text-base w-full shadow-sm"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />

          <TextInput
            className="bg-white p-3 rounded-lg mb-2 border border-gray-300 text-base w-full shadow-sm"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />

          <TextInput
            className="bg-white p-3 rounded-lg mb-2 border border-gray-300 text-base w-full shadow-sm"
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />

          <TextInput
            className="bg-white p-3 rounded-lg mb-4 border border-gray-300 text-base w-full shadow-sm"
            placeholder="Certification (Optional)"
            value={certification}
            onChangeText={setCertification}
            placeholderTextColor="#999"
          />

<Text className="text-base font-bold text-slate-800 mb-2">Elderly User Details</Text>
<TextInput
            className="bg-white p-3 rounded-lg mb-2 border border-gray-300 text-base w-full shadow-sm"
            placeholder="Elderly Name"
            value={elderlyName}
            onChangeText={setElderlyName}
            autoCapitalize="words"
            placeholderTextColor="#999"
          />

          <TextInput
            className="bg-white p-3 rounded-lg mb-2 border border-gray-300 text-base w-full shadow-sm"
            placeholder="Elderly Phone Number"
            value={elderlyPhone}
            onChangeText={setElderlyPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />

          <TextInput
            className="bg-white p-3 rounded-lg mb-4 border border-gray-300 text-base w-full shadow-sm"
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
          />

          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-3 px-8 w-full items-center mb-4 shadow-md"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-bold text-white">Register</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center mt-4">
            <Text className="text-base text-gray-500 mr-1">Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-sm font-bold text-blue-500">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
