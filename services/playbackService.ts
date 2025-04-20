import TrackPlayer, { Event, State } from 'react-native-track-player';

// Keep track of whether listeners are registered
let listenersRegistered = false;

module.exports = async function() {
  // Only register listeners once
  if (listenersRegistered) {
    return;
  }

  // Basic controls
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());
  
  // Track navigation with queue checks
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentTrack = await TrackPlayer.getActiveTrack();
      
      if (!currentTrack || queue.length === 0) return;
      
      const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
      if (currentIndex < queue.length - 1) {
        await TrackPlayer.skipToNext();
      } else {
        // At the end of queue, optionally loop back to start
        await TrackPlayer.skip(0);
      }
    } catch (error) {
      console.error('[PlaybackService] Skip next error:', error);
    }
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentTrack = await TrackPlayer.getActiveTrack();
      
      if (!currentTrack || queue.length === 0) return;
      
      const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > 0) {
        await TrackPlayer.skipToPrevious();
      } else {
        // At the start of queue, optionally go to end
        await TrackPlayer.skip(queue.length - 1);
      }
    } catch (error) {
      console.error('[PlaybackService] Skip previous error:', error);
    }
  });

  // Handle queue end
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      if (queue.length > 0) {
        console.log('[PlaybackService] Queue ended, restarting from beginning');
        await TrackPlayer.skip(0);
        await TrackPlayer.pause(); // Don't auto-play, let user decide
      }
    } catch (error) {
      console.error('[PlaybackService] Queue ended error:', error);
    }
  });

  // Seek control
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    if (event && typeof event.position === 'number') {
      TrackPlayer.seekTo(event.position);
    }
  });

  listenersRegistered = true;
};
