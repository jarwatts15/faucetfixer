import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

/**
 * The root layout for the Faucet Fixer app.
 *
 * This defines a simple stack navigator using expo-router. Each screen
 * corresponds to a file in the `app` directory. The titles for the
 * screens are set here to provide a nicer header experience.
 */
export default function RootLayout() {
  return (
    <>
      {/* Define a stack navigator with our four screens. */}
      <Stack
        screenOptions={{
          headerShown: true,
        }}
      >
        {/* Home screen */}
        <Stack.Screen
          name="index"
          options={{ title: 'Home' }}
        />
        {/* Introduction to the diagnosis flow */}
        <Stack.Screen
          name="diagnosisIntro"
          options={{ title: 'Start Diagnosis' }}
        />
        {/* Decision tree navigation */}
        <Stack.Screen
          name="decisionTree"
          options={{ title: 'Troubleshooting' }}
        />
        {/* Camera and photo upload */}
        <Stack.Screen
          name="camera"
          options={{ title: 'Camera' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
