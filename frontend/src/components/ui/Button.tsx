'use client';

import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

interface ButtonProps extends ChakraButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  const variants = {
    primary: {
      bg: 'brand.500',
      color: 'white',
      _hover: {
        bg: 'brand.600',
      },
      _active: {
        bg: 'brand.700',
      },
    },
    secondary: {
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'brand.500',
      color: 'brand.500',
      _hover: {
        bg: 'brand.50',
      },
    },
    ghost: {
      bg: 'transparent',
      color: 'text.subtle',
      _hover: {
        bg: 'gray.100',
      },
    },
    danger: {
      bg: 'danger.500',
      color: 'white',
      _hover: {
        bg: 'danger.600',
      },
    },
  };

  return (
    <ChakraButton
      variant="solid"
      size={size}
      borderRadius="6px"
      fontWeight="500"
      transition="all 0.2s"
      {...variants[variant]}
      {...props}
    >
      {children}
    </ChakraButton>
  );
}
