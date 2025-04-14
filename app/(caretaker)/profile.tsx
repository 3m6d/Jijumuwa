// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useAuth } from '../../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import * as SecureStore from 'expo-secure-store';

// // Components for profile sections
// const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     <View style={styles.sectionContent}>
//       {children}
//     </View>
//   </View>
// );

// const ProfileItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
//   <View style={styles.profileItem}>
//     <Ionicons name={icon as any} size={24} color="#4A80F0" style={styles.itemIcon} />
//     <View>
//       <Text style={styles.itemLabel}>{label}</Text>
//       <Text style={styles.itemValue}>{value}</Text>
//     </View>
//   </View>
// );

// export default function ProfileScreen() {
//   const { signOut, authState } = useAuth();
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const user = authState.user;

//   // Load profile image from storage on component mount
//   useEffect(() => {
//     const loadProfileImage = async () => {
//       try {
//         const storedImage = await SecureStore.getItemAsync('profileImage');
//         if (storedImage) {
//           setProfileImage(storedImage);
//         }
//       } catch (error) {
//         console.error('Error loading profile image:', error);
//       }
//     };

//     loadProfileImage();
//   }, []);

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to log out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             setLoading(true);
//             try {
//               await signOut();
//               // Navigation is handled in AuthContext
//             } catch (error) {
//               console.error('Logout error:', error);
//               Alert.alert('Logout Failed', 'Unable to log out. Please try again.');
//             } finally {
//               setLoading(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//     if (status !== 'granted') {
//       Alert.alert('Permission Required', 'Please grant camera roll permissions to update your profile picture');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.5,
//     });

//     if (!result.canceled) {
//       const selectedImage = result.assets[0].uri;
//       setProfileImage(selectedImage);
      
//       // Store the selected image
//       try {
//         await SecureStore.setItemAsync('profileImage', selectedImage);
//       } catch (error) {
//         console.error('Error saving profile image:', error);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4A80F0" />
//         <Text style={styles.loadingText}>Logging out...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Text style={styles.headerTitle}>Profile</Text>
//         </View>
        
//         {/* Profile Avatar */}
//         <View style={styles.avatarContainer}>
//           <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
//             {profileImage ? (
//               <Image source={{ uri: profileImage }} style={styles.avatar} />
//             ) : (
//               <View style={styles.avatarPlaceholder}>
//                 <Text style={styles.avatarPlaceholderText}>
//                   {user?.name ? user.name.substring(0, 2).toUpperCase() : 'CT'}
//                 </Text>
//               </View>
//             )}
//             <View style={styles.editIconContainer}>
//               <Ionicons name="camera" size={16} color="white" />
//             </View>
//           </TouchableOpacity>
//           <Text style={styles.userName}>{user?.name || 'Caretaker'}</Text>
//           <Text style={styles.userRole}>{user?.role || 'Healthcare Professional'}</Text>
//         </View>

//         {/* Personal Information */}
//         <ProfileSection title="Personal Information">
//           <ProfileItem 
//             icon="person-outline" 
//             label="Name" 
//             value={user?.name || 'Not provided'} 
//           />
//           <ProfileItem 
//             icon="call-outline" 
//             label="Phone" 
//             value={user?.phone_number || 'Not provided'} 
//           />
//         </ProfileSection>

//         {/* App Settings */}
//         <ProfileSection title="Settings">
//           <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/(caretaker)/notifications')}>
//             <Ionicons name="notifications-outline" size={24} color="#4A80F0" />
//             <Text style={styles.settingText}>Notifications</Text>
//             <Ionicons name="chevron-forward" size={24} color="#CCCCCC" style={styles.arrowIcon} />
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/(caretaker)/appearance')}>
//             <Ionicons name="color-palette-outline" size={24} color="#4A80F0" />
//             <Text style={styles.settingText}>Appearance</Text>
//             <Ionicons name="chevron-forward" size={24} color="#CCCCCC" style={styles.arrowIcon} />
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/(caretaker)/help')}>
//             <Ionicons name="help-circle-outline" size={24} color="#4A80F0" />
//             <Text style={styles.settingText}>Help & Support</Text>
//             <Ionicons name="chevron-forward" size={24} color="#CCCCCC" style={styles.arrowIcon} />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/(caretaker)/privacy')}>
//             <Ionicons name="shield-checkmark-outline" size={24} color="#4A80F0" />
//             <Text style={styles.settingText}>Privacy & Security</Text>
//             <Ionicons name="chevron-forward" size={24} color="#CCCCCC" style={styles.arrowIcon} />
//           </TouchableOpacity>
//         </ProfileSection>

//         {/* Logout Button */}
//         <TouchableOpacity
//           style={styles.logoutButton}
//           onPress={handleLogout}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="log-out-outline" size={24} color="white" style={styles.logoutIcon} />
//           <Text style={styles.logoutText}>Log Out</Text>
//         </TouchableOpacity>

//         {/* Version info */}
//         <Text style={styles.versionText}>Version 1.0.0</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F7FA',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5F7FA',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: '#4A80F0',
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//     backgroundColor: 'white',
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333333',
//   },
//   avatarContainer: {
//     alignItems: 'center',
//     paddingVertical: 30,
//     backgroundColor: 'white',
//   },
//   avatarWrapper: {
//     position: 'relative',
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: '#4A80F0',
//   },
//   avatarPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#E1E8FD',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#4A80F0',
//   },
//   avatarPlaceholderText: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: '#4A80F0',
//   },
//   editIconContainer: {
//     position: 'absolute',
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#4A80F0',
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: 'white',
//   },
//   userName: {
//     marginTop: 16,
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333333',
//   },
//   userRole: {
//     fontSize: 16,
//     color: '#888888',
//     marginTop: 4,
//   },
//   section: {
//     marginTop: 20,
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333333',
//   },
//   sectionContent: {
//     marginTop: 8,
//   },
//   profileItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//   },
//   itemIcon: {
//     marginRight: 16,
//   },
//   itemLabel: {
//     fontSize: 14,
//     color: '#888888',
//   },
//   itemValue: {
//     fontSize: 16,
//     color: '#333333',
//     fontWeight: '500',
//     marginTop: 2,
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEEEEE',
//   },
//   settingText: {
//     fontSize: 16,
//     color: '#333333',
//     marginLeft: 16,
//     flex: 1,
//   },
//   arrowIcon: {
//     marginLeft: 'auto',
//   },
//   logoutButton: {
//     backgroundColor: '#E74C3C',
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginTop: 30,
//     marginBottom: 16,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#E74C3C',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   logoutIcon: {
//     marginRight: 8,
//   },
//   logoutText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   versionText: {
//     textAlign: 'center',
//     color: '#888888',
//     fontSize: 14,
//     marginVertical: 20,
//   },
// });