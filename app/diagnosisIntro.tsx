import { ScrollView, View, Text, Button } from 'react-native';
import { router } from 'expo-router';

/**
 * Screen providing an introduction to the troubleshooting flow.
 *
 * This screen explains what the user should expect from the
 * troubleshooting process. A button lets the user proceed to the
 * decision tree where they'll answer a few quick questions.
 */
export default function DiagnosisIntro() {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <View style={{ maxWidth: 500 }}>
        <Text
          style={{ fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}
        >
          Getting Started
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 24, textAlign: 'center' }}>
          We'll ask you a few questions and ask you to take a photo of your
          faucet. Based on your answers and the image, we'll guide you through
          the right fixes.
        </Text>
        <Button
          title="Continue"
          onPress={() => router.push('/decisionTree')}
        />
      </View>
    </ScrollView>
  );
}