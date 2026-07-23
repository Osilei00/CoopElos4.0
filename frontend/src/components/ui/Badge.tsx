'use client';

import { Badge as ChakraBadge, BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';

interface BadgeProps extends ChakraBadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: {
      bg: 'gray.100',
      color: 'text.secondary',
    },
    success: {
      bg: 'success.50',
      color: 'success.500',
    },
    warning: {
      bg: 'warning.50',
      color: 'warning.500',
    },
    danger: {
      bg: 'danger.50',
      color: 'danger.500',
    },
    info: {
      bg: 'brand.50',
      color: 'brand.500',
    },
  };

  return (
    <ChakraBadge
      px={2}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="500"
      {...variants[variant]}
      {...props}
    >
      {children}
    </ChakraBadge>
  );
}
