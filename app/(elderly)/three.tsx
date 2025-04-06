
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import TrackPlayer, { Event, State, usePlaybackState, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import tracks from '@/constants/tracks';

export default function MusicPlayerScreen() {
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const isPlaying = playbackState?.state === State.Playing;
  const playerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function setupPlayer() {
      try {
        // Reset any existing players
        await TrackPlayer.reset();
        
        // Register playback service
        TrackPlayer.registerPlaybackService(() => require('../../services/playbackService'));

        // Initialize player
        await TrackPlayer.setupPlayer({
          minBuffer: 15,
          maxBuffer: 50,
          playBuffer: 3,
          waitForBuffer: true,
        });

        // Add tracks
        await TrackPlayer.add(tracks);
        
        if (isMounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.log('Setup error:', error);
      }
    }

    if (isMounted) {
      setupPlayer();
    }
    
    return () => {
      isMounted = false;
      TrackPlayer.reset().catch((error) => console.log('Cleanup error:', error));
    };
  }, []);

useEffect(() => {
  const trackChangeListener = TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    async ({ track }) => {
      if (typeof track === 'number') {
        try {
          const trackData = await TrackPlayer.getTrack(track);
          if (trackData) {
            setCurrentTrack(tracks.findIndex(t => t.id === trackData.id));
          }
        } catch (error) {
          console.log('Track change error:', error);
        }
      }
    }
  );

    return () => {
      trackChangeListener.remove();
    };
  }, []);

  const togglePlayback = async () => {
    try {
      if (!isReady) return;
      
      if (isPlaying) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.log('Playback error:', error);
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.log('Skip error:', error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.log('Skip error:', error);
    }
  };

  const seekTo = (value: number) => {
    TrackPlayer.seekTo(value);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text className="mt-4 text-lg">Loading Player...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-white">
=        <Text className="text-3xl font-bold mb-8">भजन</Text>
        
        {tracks[currentTrack]?.artwork && (
          <Image 
            source={tracks[currentTrack].artwork} 
            className="w-64 h-64 rounded-lg mb-6"
            resizeMode="cover"
          />
        )}
        
        <View className="items-center mb-6 w-64">
          <Text className="text-2xl font-semibold">{tracks[currentTrack]?.title || 'Unknown Track'}</Text>
          <Text className="text-xl text-gray-600">{tracks[currentTrack]?.artist || 'Unknown Artist'}</Text>
        </View>
        
        <View className="w-80 mb-6">
          <Slider
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            minimumTrackTintColor="#FF8C00"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#FF8C00"
            onSlidingComplete={seekTo}
          />
          <View className="flex-row justify-between">
            <Text className="text-gray-600">{formatTime(progress.position)}</Text>
            <Text className="text-gray-600">{formatTime(progress.duration)}</Text>
          </View>
        </View>
        
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
=    </View>
  );
}