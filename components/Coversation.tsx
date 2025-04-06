import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

export type Message = {
  id: string;
  text: string;
  sender: "user" | "sarathi";
};

type ConversationProps = {
  messages: Message[];
  loading: boolean;
};

const Conversation: React.FC<ConversationProps> = ({ messages, loading }) => {
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    const isSarathi = item.sender === "sarathi";
    const isFirstItem = index === 0;

    return (
      <View>
        {isFirstItem && loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#ff0011" />
          </View>
        )}
        <View style={[styles.messageRow, isSarathi ? null : styles.userRow]}>
          <View style={isSarathi ? styles.sarathiBubble : styles.userBubble}>
            <Text style={styles.label}>{isSarathi ? "सारथी" : "तपाई"}</Text>
            <Text style={isSarathi ? styles.sarathiText : styles.userText}>
              {item.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          inverted={true}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingTop: 20,
  },
  messageRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  sarathiBubble: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  userBubble: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  label: {
    fontWeight: "bold",
    color: "#000000",
    alignSelf: "flex-end",
  },
  sarathiText: {
    color: "#000000",
  },
  userText: {
    color: "#000000",
  },
  loadingContainer: {
    alignSelf: "flex-end",
    marginVertical: 4,
  },
});

export default Conversation;
