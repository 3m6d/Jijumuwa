import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { login, isAuthenticated, getUserRole } from '@/services/auth/authService';

export default function LoginScreen() {
  // Form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Navigation
  const router = useRouter();

  /**
   * Check if user is already authenticated on component mount
   * and redirect to appropriate dashboard if authenticated
   */
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      console.log('[LoginScreen] Initial auth check:', authenticated);
      
      if (authenticated) {
        redirectToDashboard();
      }
    };
    
    checkAuth();
  }, []);

  /**
   * Redirects user to appropriate dashboard based on role
   */
  const redirectToDashboard = async () => {
    const userRole = await getUserRole();
    console.log('[LoginScreen] Redirecting user with role:', userRole);
    
    if (userRole === 'elderly') {
      console.log('[LoginScreen] → Redirecting to elderly dashboard');
      router.replace('/(elderly)/dashboard');
    } else if (userRole === 'caretaker') {
      console.log('[LoginScreen] → Redirecting to caretaker dashboard');
      router.replace('/(caretaker)/dashboard');
    } else {
      console.log('[LoginScreen] → Unknown role, redirecting to default dashboard:', userRole);
      router.replace('/(elderly)/dashboard');
    }
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async () => {
    // Form validation
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    
    try {
      // Normalize phone number format - remove spaces
      const normalizedPhone = phoneNumber.trim().replace(/\s+/g, '');
      console.log(`[LoginScreen] Logging in with phone: ${normalizedPhone}`);
      
      // Attempt login
      const result = await login(normalizedPhone, password);
      console.log('[LoginScreen] Login result:', result);
      
      if (result.success) {
        console.log('[LoginScreen] Login successful, user role:', result.role);
        
        // Redirect based on user role
        if (result.role === 'elderly') {
          console.log('[LoginScreen] → Navigation to elderly dashboard');
          router.replace('/(elderly)/dashboard');
        } else if (result.role === 'caretaker') {
          console.log('[LoginScreen] → Navigation to caretaker dashboard');
          router.replace('/(caretaker)/dashboard');
        } else {
          console.log('[LoginScreen] → Unknown role:', result.role);
          Alert.alert('Login Error', `Unknown user role: ${result.role}`);
        }
      } else {
        console.log('[LoginScreen] Login failed:', result.error);
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('[LoginScreen] Login error details:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render login form
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />
      <BackgroundGradient />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-5"
      >
        {/* App logo */}
        <View className="items-center mb-8">
          <Image
            source={require('../../assets/images/adaptive-icon.png')}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-slate-800 text-center mb-8">
          Login
        </Text>

        {/* Phone number input */}
        <TextInput
          className="bg-white p-4 rounded-lg mb-4 border border-gray-300 text-lg w-full shadow-sm"
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
        
        {/* Password input */}
        <TextInput
          className="bg-white p-4 rounded-lg mb-6 border border-gray-300 text-lg w-full shadow-sm"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        {/* Login button */}
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

        {/* Register link */}
        <View className="flex-row items-center justify-center mt-4">
          <Text className="text-base text-gray-500 mr-1">Don't have an account?</Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text className="text-base font-bold text-blue-500">Register</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {/* Forgotten password - commented out for now */}
        {/* <TouchableOpacity className="items-center mt-4">
          <Link href="/forgot-password" asChild>
            <Text className="text-base text-gray-500">Forgot Password?</Text>
          </Link>
        </TouchableOpacity> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}