import { View, Text, TextInput, Button } from "react-native";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { fetch } from "expo/fetch";
import { useCallback, useEffect, useState } from "react";

export default function HomeScreen() {
  const [messages, setMessages] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/stream");

    if (!response.ok || !response.body) {
      throw new Error("Failed to fetch data");
    }

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const msg = new TextDecoder().decode(value);

      setMessages((prev) => [...prev, msg]);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={{ margin: 10 }}>
          <Button onPress={loadData} title="Load Data" />
          <Text>{JSON.stringify(messages)}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
