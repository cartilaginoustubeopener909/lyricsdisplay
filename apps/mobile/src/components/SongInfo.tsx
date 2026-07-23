import React from 'react';
import { Image, Text, View } from 'react-native';
import { Song, useSongDetails } from '@lyricsdisplay/shared';
import { Music } from 'lucide-react-native';

interface SongInfoProps {
  song: Song | null;
  showTitle: boolean;
  showArtists: boolean;
  showCover: boolean;
  fontSize: number;
}

export const SongInfo: React.FC<SongInfoProps> = React.memo(
  ({ song, showTitle, showArtists, showCover }) => {
    const { isAvailable, title, artists, coverUrl } = useSongDetails(song);

    return (
      <View className="flex-row items-center justify-start px-4">
        {showCover &&
          (coverUrl ? (
            <Image
              source={{ uri: coverUrl }}
              className="rounded-lg border-[1px] border-white/10 w-16 h-16"
            />
          ) : (
            <View className="rounded-lg mr-3 bg-white/5 border-[1px] border-white/10 items-center justify-center w-16 h-16">
              <Music color="rgba(255,255,255,0.4)" size={20} />
            </View>
          ))}
        <View className="flex-1 items-start justify-center px-4">
          {showTitle && isAvailable && (
            <Text
              className="font-bold text-white text-[17px]"
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
          {showArtists && isAvailable && (
            <Text className="text-white text-[13px]" numberOfLines={1}>
              {artists}
            </Text>
          )}
        </View>
      </View>
    );
  },
);
