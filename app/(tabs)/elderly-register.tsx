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
import { useRouter } from 'expo-router';
import axios, { AxiosError } from 'axios';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { globalConfig } from '@/global-config';

export default function ElderlyRegisterScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    if (!phoneNumber.match(/^\d{10}$/)) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name,
        phone_number: phoneNumber,
        password,
        role: 'elderly',
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
            Register as Elderly
          </Text>

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
            className="bg-white p-3 rounded-lg mb-4 border border-gray-300 text-base w-full shadow-sm"
            placeholder="Password (min 6 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
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