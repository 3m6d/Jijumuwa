import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { clearAuthData, getUserData, getUserRole } from '@/services/auth/authService';
import { useRouter } from 'expo-router';

// Components for profile sections
const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const ProfileItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <View style={styles.profileItem}>
    <Ionicons name={icon as any} size={24} color="#4A80F0" style={styles.itemIcon} />
    <View>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

interface CaretakerData {
  name: string;
  phone_number: string;
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [caretakerData, setCaretakerData] = useState<CaretakerData | null>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>('Not provided');
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setFetching(true);
        const [userData, role] = await Promise.all([
          getUserData(),
          getUserRole()
        ]);
        
        if (userData) {
          setCaretakerData({
            name: userData.name || 'Caretaker',
            phone_number: userData.phone_number || 'Not provided'
          });
        }
        
        if (role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      } finally {
        setFetching(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await clearAuthData();
              router.push("/(tabs)/login")
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Logout Failed', 'Unable to log out. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (loading || fetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A80F0" />
        <Text style={styles.loadingText}>{loading ? 'Logging out...' : 'Loading profile...'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#4A80F0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>
              {caretakerData?.name ? caretakerData.name.substring(0, 2).toUpperCase() : 'CT'}
            </Text>
          </View>
          <Text style={styles.userName}>{caretakerData?.name || 'Caretaker'}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
        </View>

        {/* Personal Information */}
        <ProfileSection title="Personal Information">
          <ProfileItem 
            icon="person-outline" 
            label="Name" 
            value={caretakerData?.name || 'Not provided'} 
          />
          <ProfileItem 
            icon="call-outline" 
            label="Phone" 
            value={caretakerData?.phone_number || 'Not provided'} 
          />
        </ProfileSection>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="white" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4A80F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E1E8FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4A80F0',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4A80F0',
  },
  userName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  userRole: {
    fontSize: 16,
    color: '#888888',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  sectionContent: {
    marginTop: 8,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  itemIcon: {
    marginRight: 16,
  },
  itemLabel: {
    fontSize: 14,
    color: '#888888',
  },
  itemValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 30,
    marginBottom: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 14,
    marginVertical: 20,
  },
});