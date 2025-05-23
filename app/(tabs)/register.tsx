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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [certification, setCertification] = useState('');
  const [loading, setLoading] = useState(false);
  const [showElderlyForm, setShowElderlyForm] = useState(false);
  const [elderlyName, setElderlyName] = useState('');
  const [elderlyPhone, setElderlyPhone] = useState('');
  const [elderlyPin, setElderlyPin] = useState('');
  const router = useRouter();

  const validateCaretakerForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }
    if (!phoneNumber.match(/^\d{10}$/)) {
      Alert.alert('Error', 'Phone number must be 10 digits');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const validateElderlyForm = () => {
    if (!elderlyName.trim()) {
      Alert.alert('Error', 'Elderly name is required');
      return false;
    }
    if (!elderlyPhone.match(/^\d{10}$/)) {
      Alert.alert('Error', 'Elderly phone number must be 10 digits');
      return false;
    }
    if (elderlyPin.length !== 4) {
      Alert.alert('Error', 'Elderly PIN must be exactly 4 digits');
      return false;
    }
    if (phoneNumber === elderlyPhone) {
      Alert.alert('Error', 'Caretaker and elderly cannot have the same phone number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCaretakerForm()) {
      setShowElderlyForm(true);
    }
  };

  const handleBack = () => {
    setShowElderlyForm(false);
  };

  const handleRegister = async () => {
    if (!validateCaretakerForm() || !validateElderlyForm()) {
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
      // Log the full error to console for debugging
      if (error instanceof Error) {
        console.error('[RegisterScreen] Registration error:', error.message);
      } else {
        console.error('[RegisterScreen] Registration error:', error);
      }

      let message = 'Something went wrong';
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ 
          phone_number?: string[];
          elderly_user?: {
            phone_number?: string[];
          };
          non_field_errors?: string[];
        }>;
        
        const errorData = axiosError.response?.data;
        
        // Check for specific phone number errors
        if (errorData?.phone_number?.includes('User with this phone number already exists.')) {
          message = 'This caretaker phone number is already registered. Please use a different number or login.';
        } else if (errorData?.elderly_user?.phone_number?.includes('custom user with this phone number already exists.')) {
          message = 'This elderly phone number is already registered. Please use a different number.';
        } else {
          // Fallback to any other error messages
          message =
            axiosError.response?.data?.phone_number?.[0] ||
            axiosError.response?.data?.elderly_user?.phone_number?.[0] ||
            axiosError.response?.data?.non_field_errors?.[0] ||
            'Registration failed. Please try again.';
        }
      }
      Alert.alert('Registration Error', message);
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
            {showElderlyForm ? 'Elderly Details' : 'Register as Caretaker'}
          </Text>

          {!showElderlyForm ? (
            <>
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

              <TouchableOpacity
                className="bg-blue-500 rounded-lg py-3 px-8 w-full items-center mb-4 shadow-md"
                onPress={handleNext}
                disabled={loading}
              >
                <Text className="text-lg font-bold text-white">Next</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
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

              <View className="flex-row justify-between mb-4">
                <TouchableOpacity
                  className="bg-gray-300 rounded-lg py-3 px-8 w-[48%] items-center shadow-md"
                  onPress={handleBack}
                  disabled={loading}
                >
                  <Text className="text-lg font-bold text-gray-700">Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-blue-500 rounded-lg py-3 px-8 w-[48%] items-center shadow-md"
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-lg font-bold text-white">Register</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

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
