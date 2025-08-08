import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';
import { useFlowStore } from '../src/store/useFlowStore';

/**
 * A simple decision tree screen for the user to indicate what issue they're having.
 *
 * For now, this screen offers two options. When the user selects an option,
 * we store their choice in a central store (zustand) and then navigate to
 * the camera screen. In a more complex app, you could present additional
 * questions before taking a photo or call out to an AI.
 */
export default function DecisionTree() {
  const setIssue = useFlowStore((state) => state.setIssue);

  const handleSelect = (issue: string) => {
    setIssue(issue);
    router.push('/camera');
  };

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
    >
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 24 }}>
        What seems to be the problem?
      </Text>
      <View style={{ width: '80%', marginBottom: 16 }}>
        <Button title="Faucet is leaking" onPress={() => handleSelect('leaking')} />
      </View>
      <View style={{ width: '80%', marginBottom: 16 }}>
        <Button title="No water flow" onPress={() => handleSelect('no_flow')} />
      </View>
      <View style={{ width: '80%' }}>
        <Button
          title="Other issue"
          onPress={() => handleSelect('other')}
        />
      </View>
    </View>
  );
}