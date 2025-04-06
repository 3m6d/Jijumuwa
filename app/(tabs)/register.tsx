import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext'; 
import { Link, router } from 'expo-router'; 

export default function RegisterScreen() {
  const [userType, setUserType] = useState<'elderly' | 'caretaker'>('elderly');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    // Input Validation
    if (!name) {
      setError('Name is required.');
      setLoading(false);
      return;
    }
    if (!phoneNumber) {
      setError('Phone number is required.');
      setLoading(false);
      return;
    }

    let passwordToSend: string;
    if (userType === 'elderly') {
      if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        setError('PIN must be exactly 4 digits.');
        setLoading(false);
        return;
      }
      passwordToSend = pin;
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      passwordToSend = password;
    }

    const userData = {
      name,
      phone_number: phoneNumber,
      password: passwordToSend,
      user_type: userType,
    };

    try {
      await signUp(userData);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
          <Text className="text-3xl font-bold text-center mb-8 text-gray-800">Register</Text>

          {error ? <Text className="text-red-500 text-center mb-4">{error}</Text> : null}

          {/* User Type Selection */}
          <View className="flex-row justify-around mb-8">
            <TouchableOpacity
              className={`p-4 rounded-lg border ${userType === 'elderly' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
              onPress={() => setUserType('elderly')}
            >
              <Text className={`text-lg ${userType === 'elderly' ? 'text-blue-500 font-bold' : 'text-gray-600'}`}>Elderly User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-4 rounded-lg border ${userType === 'caretaker' ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
              onPress={() => setUserType('caretaker')}
            >
              <Text className={`text-lg ${userType === 'caretaker' ? 'text-blue-500 font-bold' : 'text-gray-600'}`}>Caretaker</Text>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <TextInput
            className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
          <TextInput
            className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg"
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholderTextColor="#999"
          />

          {userType === 'elderly' ? (
            <TextInput
              className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg"
              placeholder="4-Digit PIN"
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              placeholderTextColor="#999"
            />
          ) : (
            <TextInput
              className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          )}

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-blue-500 p-4 rounded-lg mb-6 items-center"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">Register</Text>
            )}
          </TouchableOpacity>

          {/* Link to Login Screen */}
          <Link href="/(tabs)/login" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 text-center text-lg">Already have an account? Login</Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
