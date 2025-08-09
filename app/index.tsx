import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

/**
 * The home screen of the Faucet Fixer app.
 *
 * Presents a simple welcome message and a button to start the
 * troubleshooting flow. Navigation is handled via expo-router's
 * `router.push` method, which updates the current route to the
 * specified screen.
 */
export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Faucet Fixer
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
        Let's diagnose your faucet problem step by step.
      </Text>
      <Button
        title="Start Diagnosis"
        onPress={() => router.push('/diagnosisIntro')}
      />
    </View>
  );
}