import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Pressable } from 'react-native';
import { signOut } from '@/lib/auth';
import { Alert } from 'react-native';

export default function UserTabs() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/login');
    }
  };

  return (
    <Tabs screenOptions={{
      headerShown: true,
      title: 'Usuario',
      headerRight: () => (
        <Pressable onPress={handleLogout} style={{ marginRight: 16 }}>
          <IconSymbol size={26} name="rectangle.portrait.and.arrow.right" color="#fff" />
        </Pressable>
      ),
    }}>
      <Tabs.Screen
        name="pedir"
        options={{
          title: 'Pedir',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="cart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="modificar"
        options={{
          title: 'Modificar',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="pencil.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rastrear"
        options={{
          title: 'Rastrear',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="location.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}