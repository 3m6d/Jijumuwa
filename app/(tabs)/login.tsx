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
import { Link } from 'expo-router';
import { BackgroundGradient } from '@/components/BackgroundGradient';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      console.log('Login attempt with:', { phoneNumber, password });
      // You can add your authentication logic here later
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
          Login
        </Text>

        <TextInput
          className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
        
        <TextInput
          className="bg-white p-4 rounded-lg mb-6 border border-gray-300 text-lg w-full shadow-sm"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-4 px-10 w-full items-center mb-5 shadow-md"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-bold text-white">Login</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-base text-gray-500 mr-1">Don't have an account?</Text>
          <Link href="/(tabs)/register" asChild>
            <TouchableOpacity>
              <Text className="text-base font-bold text-blue-500">Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <TouchableOpacity className="items-center mt-4">
          <Text className="text-base text-gray-500">Forgot Password?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}