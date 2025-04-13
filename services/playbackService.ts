import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function() {
  // This is the function that will be called by the player
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.reset());
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    if (event && typeof event.position === 'number') {
      TrackPlayer.seekTo(event.position);
    }
  });
};
