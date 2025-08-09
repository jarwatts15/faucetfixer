import React from 'react';
import { ScrollView, View, Text, Image, Button } from 'react-native';
import { useFlowStore } from '../src/store/useFlowStore';
import { router } from 'expo-router';

export default function ResultsScreen() {
  const { intakeData, issue, photoUri } = useFlowStore((state) => ({
    intakeData: state.intakeData,
    issue: state.issue,
    photoUri: state.photoUri,
  }));

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View style={{ maxWidth: 800, width: '100%', alignSelf: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16, textAlign: 'center' }}>
          Review & Continue
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Selected Issue</Text>
          <Text>{issue ?? 'Not specified yet'}</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Intake Details</Text>
          <Text>Full Name: {intakeData?.fullName ?? '-'}</Text>
          <Text>Email: {intakeData?.email ?? '-'}</Text>
          <Text>Issue Description: {intakeData?.issueDescription ?? '-'}</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Photo</Text>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={{ width: '100%', height: 300 }}
              resizeMode="contain"
            />
          ) : (
            <Text>No photo selected yet</Text>
          )}
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            title="Looks Good — Get Fix Steps"
            onPress={() => {
              // Placeholder: this is where you'd trigger analysis or navigate to a fixes screen
              router.back();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}