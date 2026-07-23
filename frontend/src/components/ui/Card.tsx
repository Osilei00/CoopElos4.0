'use client';

import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';

interface CardProps extends BoxProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, variant = 'default', ...props }: CardProps) {
  const bgColor = useColorModeValue('white', 'dark.bg.secondary');
  const borderColor = useColorModeValue('border.light', 'dark.border.light');
  const hoverBg = useColorModeValue('gray.50', 'dark.bg.tertiary');

  const variants = {
    default: {
      bg: bgColor,
      border: '1px solid',
      borderColor: borderColor,
      borderRadius: '8px',
      boxShadow: 'sm',
    },
    elevated: {
      bg: bgColor,
      border: '1px solid',
      borderColor: borderColor,
      borderRadius: '8px',
      boxShadow: 'md',
    },
    outlined: {
      bg: 'transparent',
      border: '1px solid',
      borderColor: borderColor,
      borderRadius: '8px',
    },
  };

  return (
    <Box
      {...variants[variant]}
      transition="all 0.2s"
      _hover={variant === 'default' ? { bg: hoverBg } : undefined}
      {...props}
    >
      {children}
    </Box>
  );
}
