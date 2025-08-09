import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Button, ActivityIndicator, Alert } from 'react-native';
import { useFlowStore } from '../src/store/useFlowStore';

export default function ResultsScreen() {
  const { intakeData, issue, photoUri, photoBase64 } = useFlowStore((state) => ({
    intakeData: state.intakeData,
    issue: state.issue,
    photoUri: state.photoUri,
    photoBase64: state.photoBase64,
  }));

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setSummary(null);
      setSuggestions(null);
      setConfidence(null);

      const res = await fetch('http://localhost:4000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue, intakeData, photoBase64 }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setSummary(data.summary ?? null);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : null);
      setConfidence(typeof data.confidence === 'number' ? data.confidence : null);
    } catch (err: any) {
      Alert.alert('Analysis Error', err.message || 'Failed to analyze.');
    } finally {
      setLoading(false);
    }
  };

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
            title={loading ? 'Analyzing…' : 'Looks Good — Get Fix Steps'}
            onPress={handleAnalyze}
            disabled={loading}
          />
        </View>

        {loading && (
          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>Analyzing your inputs…</Text>
          </View>
        )}

        {(summary || suggestions) && (
          <View style={{ marginTop: 24 }}>
            {summary && (
              <Text style={{ fontWeight: '600', marginBottom: 8 }}>Summary</Text>
            )}
            {summary && <Text style={{ marginBottom: 16 }}>{summary}</Text>}
            {Array.isArray(suggestions) && suggestions.length > 0 && (
              <>
                <Text style={{ fontWeight: '600', marginBottom: 8 }}>Suggested Steps</Text>
                {suggestions.map((s, idx) => (
                  <Text key={idx} style={{ marginBottom: 6 }}>• {s}</Text>
                ))}
              </>
            )}
            {typeof confidence === 'number' && (
              <Text style={{ marginTop: 12, color: '#666' }}>Confidence: {(confidence * 100).toFixed(0)}%</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}