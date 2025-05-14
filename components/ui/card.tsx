import * as React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';

interface CardProps extends ViewProps {}
interface CardHeaderProps extends ViewProps {}
interface CardTitleProps extends TextProps {}
interface CardDescriptionProps extends TextProps {}
interface CardContentProps extends ViewProps {}
interface CardFooterProps extends ViewProps {}

const Card = React.forwardRef<View, CardProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[
        styles.card,
        style,
      ]}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, CardHeaderProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[
        styles.cardHeader,
        style,
      ]}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<Text, CardTitleProps>(
  ({ style, ...props }, ref) => (
    <Text
      ref={ref}
      style={[
        styles.cardTitle,
        style,
      ]}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<Text, CardDescriptionProps>(
  ({ style, ...props }, ref) => (
    <Text
      ref={ref}
      style={[
        styles.cardDescription,
        style,
      ]}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, CardContentProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[
        styles.cardContent,
        style,
      ]}
      {...props}
    />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, CardFooterProps>(
  ({ style, ...props }, ref) => (
    <View
      ref={ref}
      style={[
        styles.cardFooter,
        style,
      ]}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'column',
    padding: 24,
    gap: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: '#111827',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardContent: {
    padding: 24,
    paddingTop: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 0,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };