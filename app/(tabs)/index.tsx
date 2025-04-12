import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Link } from 'expo-router';
import { BackgroundGradient } from '@/components/BackgroundGradient';


export default function WelcomeScreen() {  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />

      <View className="flex-1 items-center justify-center p-5">
        <BackgroundGradient />

        <Image
          source={require('../../assets/images/adaptive-icon.png')}
          className="w-36 h-36 mb-8"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-slate-800 text-center mb-3">
          Welcome to Project Jijumuwa
        </Text>
        <Text className="text-base text-gray-500 text-center mb-10 px-5">
          Connect with your loved ones and caregivers in one secure platform
        </Text>

        <Link href="/(elderly)/dashboard" asChild>
          <TouchableOpacity className="bg-blue-500 rounded-lg py-4 px-10 w-4/5 items-center mb-5 shadow-md">
            <Text className="text-lg font-bold text-white">Get Started</Text>
          </TouchableOpacity>
        </Link>

        <View className="flex-row items-center mt-4">
          <Text className="text-base text-gray-500 mr-1">Already have an account?</Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text className="text-base font-bold text-blue-500">Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};
