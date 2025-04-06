import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Add local error state for persistent message
  const { signIn, authState } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (authState.accessToken && !authState.isLoading) {
  //     let targetRoute = '/(tabs)/login'; 
  //     if (authState.userRole === 'elderly') {
  //       targetRoute = '/(elderly)/dashboard';
  //     } else if (authState.userRole === 'caretaker') {
  //       targetRoute = '/(caretaker)/dashboard';
  //     }
  //     else return;
  //     router.replace(targetRoute as any); 
  //   }
  //   else return;
  // }, [authState.accessToken, authState.userRole, authState.isLoading, router]);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      setError('Phone number and password are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn({ phone_number: phoneNumber, password });
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // if (authState.isLoading) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-gray-100">
  //       <ActivityIndicator size="large" />
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (authState.accessToken) {
  //   return (
  //     <View className="flex-1 justify-center items-center bg-gray-100">
  //       <ActivityIndicator size="large" />
  //       <Text>Logging you in...</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <View className="flex-1 justify-center items-center bg-gray-100">
  //     <Text>Loading...</Text>
  //   </View>
  // );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-5"
      >
        <Text className="text-3xl font-bold text-center mb-10 text-gray-800">Login</Text>

        {error ? <Text className="text-red-500 text-center mb-4">{error}</Text> : null}

        <TextInput
          className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholderTextColor="#999"
        />
        <TextInput
          className="bg-white p-4 rounded-lg mb-6 border border-gray-300 text-lg"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg mb-4 items-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Login</Text>
          )}
        </TouchableOpacity>

        <Link href="/(tabs)/register" asChild>
          <TouchableOpacity>
            <Text className="text-blue-500 text-center text-lg">Don't have an account? Register</Text>
          </TouchableOpacity>
        </Link>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// export default function LoginScreen() {
//   return (
//     <View className="flex-1 justify-center items-center bg-gray-100">
//       <Text>Loading...</Text>
//     </View>
//   );
// }
