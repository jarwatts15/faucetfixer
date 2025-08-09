import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useFlowStore } from '../src/store/useFlowStore';
import { router } from 'expo-router';

/**
 * Screen for capturing or selecting an image of the faucet.
 *
 * This screen requests camera permissions from the user, displays a camera
 * preview, and allows the user to either take a photo or pick one from
 * their library. The captured/selected photo URI is stored in a global
 * zustand store. In a full implementation, this image could be sent to
 * a backend or used in an AI model for further analysis.
 */
export default function CameraScreen() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef<Camera | null>(null);
  const [photoUri, setPhotoUriLocal] = useState<string | null>(null);
  const setPhotoUri = useFlowStore((state) => state.setPhotoUri);

  // Request permissions when the component mounts
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleTakePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUriLocal(photo.uri);
        setPhotoUri(photo.uri);
      }
    } catch (error) {
      console.warn('Error taking photo', error);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUriLocal(uri);
      setPhotoUri(uri);
    }
  };

  const resetPhoto = () => {
    setPhotoUriLocal(null);
    setPhotoUri(null);
  };

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Camera permission is required to take photos.</Text>
        <Button title="Grant Permission" onPress={() => requestPermission()} />
      </View>
    );
  }

  // Display the captured or selected photo if available
  if (photoUri) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Image
          source={{ uri: photoUri }}
          style={{ width: '100%', height: '70%', marginBottom: 16 }}
          resizeMode="contain"
        />
        <Button title="Retake Photo" onPress={resetPhoto} />
        <View style={{ height: 12 }} />
        <Button
          title="Continue"
          onPress={() => {
            router.push('/results');
          }}
        />
        <View style={{ height: 12 }} />
        <Button
          title="Back to Troubleshooting"
          onPress={() => {
            resetPhoto();
            router.back();
          }}
        />
      </View>
    );
  }

  // Otherwise show the camera preview with action buttons
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={(ref) => {
          cameraRef.current = ref;
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}
      >
        <Button title="Take Photo" onPress={handleTakePhoto} />
        <Button title="Pick from Gallery" onPress={handlePickImage} />
      </View>
    </View>
  );
}