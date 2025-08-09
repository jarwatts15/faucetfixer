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
        Choose how you’d like to proceed: fill out a quick intake form or use photo diagnosis.
      </Text>
      <View style={{ width: '80%', marginBottom: 12 }}>
        <Button
          title="Use Intake Form"
          onPress={() => router.push('/intakeForm')}
        />
      </View>
      <View style={{ width: '80%', marginBottom: 12 }}>
        <Button
          title="Photo Diagnosis"
          onPress={() => router.push('/camera')}
        />
      </View>
      <View style={{ width: '80%' }}>
        <Button
          title="Open Tabs"
          onPress={() => router.push('/tabs')}
        />
      </View>
    </View>
  );
}