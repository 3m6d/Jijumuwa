import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import TrackPlayer, { Event, State, usePlaybackState, useProgress } from 'react-native-track-player';
import { fetchBhajans, Bhajan } from '@/services/bhajanService';
import { globalConfig } from '@/global-config';

// Keep track of initialization state globally
let isPlayerInitialized = false;
let isServiceRegistered = false;

export default function MusicPlayerScreen() {
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [bhajans, setBhajans] = useState<Bhajan[]>([]);
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const isPlaying = playbackState?.state === State.Playing;
  const playerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    async function setupPlayer() {
      try {
        console.log('[MusicPlayer] Starting setup...');
        
        // Fetch bhajans from backend
        const fetchedBhajans = await fetchBhajans().catch(error => {
          console.error('[MusicPlayer] Failed to fetch bhajans:', error);
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`[MusicPlayer] Retrying fetch (${retryCount}/${MAX_RETRIES})...`);
            return setupPlayer();
          }
          throw error;
        });

        if (!isMounted) return;
        if (!fetchedBhajans || fetchedBhajans.length === 0) {
          throw new Error('No bhajans available');
        }

        setBhajans(fetchedBhajans);

        // Only register the service once
        if (!isServiceRegistered) {
          console.log('[MusicPlayer] Registering playback service...');
          await TrackPlayer.registerPlaybackService(() => require('../../services/playbackService'));
          isServiceRegistered = true;
        }
        
        // Check if player is already initialized
        let playerIsSetup = false;
        try {
          await TrackPlayer.getState();
          playerIsSetup = true;
          console.log('[MusicPlayer] Player already initialized');
        } catch {
          playerIsSetup = false;
          console.log('[MusicPlayer] Player needs initialization');
        }
        
        // Initialize player only if not already initialized
        if (!playerIsSetup) {
          console.log('[MusicPlayer] Setting up player...');
          await TrackPlayer.setupPlayer({
            minBuffer: 15,
            maxBuffer: 50,
            playBuffer: 3,
            waitForBuffer: true,
          });
          isPlayerInitialized = true;
        }
        
        // Reset any existing players
        console.log('[MusicPlayer] Resetting player...');
        await TrackPlayer.reset();

        // Add tracks from backend
        const tracks = fetchedBhajans.map(bhajan => {
          console.log('[MusicPlayer] Adding track:', {
            id: bhajan.id,
            url: bhajan.file_path,
            title: bhajan.title
          });
          
          return {
            id: bhajan.id.toString(),
            url: bhajan.file_path, // Use the full URL directly from the backend
            title: bhajan.title,
            artist: bhajan.artist || 'Unknown Artist',
            duration: bhajan.duration ? parseInt(bhajan.duration) : 0,
          };
        });

        console.log('[MusicPlayer] Adding tracks to player...');
        await TrackPlayer.add(tracks);
        
        if (isMounted) {
          console.log('[MusicPlayer] Setup complete, player is ready');
          setIsReady(true);
        }
      } catch (error) {
        console.error('[MusicPlayer] Setup error:', error);
        if (isMounted) {
          Alert.alert(
            'Loading Error',
            'Failed to load music. Please check your internet connection and try again.',
            [
              {
                text: 'Retry',
                onPress: () => {
                  if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    setupPlayer();
                  }
                }
              },
              { text: 'OK', style: 'cancel' }
            ]
          );
        }
      }
    }

    setupPlayer();
    
    return () => {
      console.log('[MusicPlayer] Cleaning up...');
      isMounted = false;
      // Only try to reset if the player was initialized
      if (isReady) {
        TrackPlayer.reset().catch((error) => {
          // Only log the error if it's not about initialization
          if (!error.message.includes('not initialized')) {
            console.error('[MusicPlayer] Cleanup error:', error);
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    const trackChangeListener = TrackPlayer.addEventListener(
      Event.PlaybackTrackChanged,
      async ({ nextTrack }) => {
        try {
          console.log('[MusicPlayer] Track changing to:', nextTrack);
          if (nextTrack !== null) {
            const trackData = await TrackPlayer.getTrack(nextTrack);
            console.log('[MusicPlayer] New track data:', trackData);
            if (trackData) {
              const newIndex = bhajans.findIndex(b => b.id.toString() === trackData.id);
              console.log('[MusicPlayer] Setting current track index to:', newIndex);
              setCurrentTrack(newIndex);
            }
          }
        } catch (error) {
          console.error('[MusicPlayer] Track change error:', error);
        }
      }
    );

    return () => {
      trackChangeListener.remove();
    };
  }, [bhajans]);

  const togglePlayback = async () => {
    try {
      if (!isReady) {
        console.log('[MusicPlayer] Player not ready yet');
        return;
      }
      
      console.log('[MusicPlayer] Toggling playback, current state:', isPlaying);
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('[MusicPlayer] Playback error:', error);
      Alert.alert('Playback Error', 'Failed to play/pause. Please try again.');
    }
  };

  const skipToNext = async () => {
    try {
      console.log('[MusicPlayer] Attempting to skip to next track');
      const queue = await TrackPlayer.getQueue();
      const currentTrack = await TrackPlayer.getActiveTrack();
      
      if (!currentTrack || queue.length === 0) {
        console.log('[MusicPlayer] No tracks in queue');
        return;
      }
      
      const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
      if (currentIndex === queue.length - 1) {
        console.log('[MusicPlayer] Already at last track');
        await TrackPlayer.skip(0);
      } else {
        await TrackPlayer.skipToNext();
      }
    } catch (error) {
      console.error('[MusicPlayer] Skip error:', error);
      Alert.alert('Skip Error', 'Failed to skip to next track. Please try again.');
    }
  };

  const skipToPrevious = async () => {
    try {
      console.log('[MusicPlayer] Attempting to skip to previous track');
      const queue = await TrackPlayer.getQueue();
      const currentTrack = await TrackPlayer.getActiveTrack();
      
      if (!currentTrack || queue.length === 0) {
        console.log('[MusicPlayer] No tracks in queue');
        return;
      }
      
      const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
      if (currentIndex === 0) {
        console.log('[MusicPlayer] Already at first track');
        await TrackPlayer.skip(queue.length - 1);
      } else {
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error('[MusicPlayer] Skip error:', error);
      Alert.alert('Skip Error', 'Failed to skip to previous track. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#df912a" />
        <Text className="mt-4 text-lg">Loading Player...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-3xl font-bold mb-8">भजन</Text>
        
        {/* Album Art */}
        <View className="w-64 h-64 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            source={require('@/assets/images/defaultMusic.jpeg')}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="items-center mb-6 w-64">
          <Text className="text-2xl font-semibold text-center">{bhajans[currentTrack]?.title || 'Unknown Track'}</Text>
          <Text className="text-xl text-gray-600 text-center">{bhajans[currentTrack]?.artist || 'Unknown Artist'}</Text>
        </View>
        
        {/* Progress bar */}
        <View className="w-80 mb-6">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">{formatTime(progress.position)}</Text>
            <Text className="text-gray-600">{formatTime(progress.duration)}</Text>
          </View>
        </View>
        
        {/* Controls */}
        <View className="flex-row items-center justify-center w-full mb-6">
          <TouchableOpacity 
            className="mx-4 p-3 bg-gray-200 rounded-full" 
            onPress={skipToPrevious}
          >
            <Text className="text-2xl">⏮️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="w-20 h-20 bg-yellow-500 rounded-full justify-center items-center mx-6"
            onPress={togglePlayback}
          >
            <Text className="text-3xl text-white font-bold">
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="mx-4 p-3 bg-gray-200 rounded-full" 
            onPress={skipToNext}
          >
            <Text className="text-2xl">⏭️</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}