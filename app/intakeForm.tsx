import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import { useFlowStore, type IntakeData } from '../src/store/useFlowStore';

export default function IntakeFormScreen() {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>('');

  const setIntakeData = useFlowStore((state) => state.setIntakeData);

  const handleSubmit = () => {
    if (!issueDescription.trim()) {
      Alert.alert('Incomplete', 'Please provide a brief description of the issue.');
      return;
    }

    const data: IntakeData = {
      fullName: fullName.trim() || undefined,
      email: email.trim() || undefined,
      issueDescription: issueDescription.trim(),
    };

    setIntakeData(data);
    router.push('/decisionTree');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View style={{ maxWidth: 600, width: '100%', alignSelf: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
          Intake Form
        </Text>
        <Text style={{ fontSize: 14, color: '#555', marginBottom: 16, textAlign: 'center' }}>
          Provide a few details and we will tailor the troubleshooting steps for you.
        </Text>

        <Text style={{ marginBottom: 8 }}>Full Name (optional)</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Jane Doe"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text style={{ marginBottom: 8 }}>Email (optional)</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="jane@example.com"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />

        <Text style={{ marginBottom: 8 }}>Briefly describe the issue</Text>
        <TextInput
          value={issueDescription}
          onChangeText={setIssueDescription}
          placeholder="e.g., The faucet is dripping steadily even when shut off."
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
            minHeight: 100,
            textAlignVertical: 'top',
          }}
          multiline
        />

        <View style={{ marginBottom: 12 }}>
          <Button title="Submit and Continue" onPress={handleSubmit} />
        </View>
        <Button
          title="Skip and Use Photo Diagnosis"
          onPress={() => router.push('/diagnosisIntro')}
        />
      </View>
    </ScrollView>
  );
}