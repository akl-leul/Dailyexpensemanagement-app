// FadeUpView.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface FadeUpViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
}

export default function FadeUpView({ children, style, delay = 0 }: FadeUpViewProps) {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        { transform: [{ translateY }], opacity },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
