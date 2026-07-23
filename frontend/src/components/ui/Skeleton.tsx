'use client';

import { 
  Skeleton as ChakraSkeleton, 
  SkeletonProps as ChakraSkeletonProps,
  Box,
  Stack,
} from '@chakra-ui/react';

interface SkeletonProps extends ChakraSkeletonProps {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  count?: number;
}

export function Skeleton({ variant = 'text', count = 1, ...props }: SkeletonProps) {
  const variants = {
    text: {
      height: '20px',
      width: '100%',
      borderRadius: '4px',
    },
    circle: {
      height: '40px',
      width: '40px',
      borderRadius: '50%',
    },
    rect: {
      height: '100px',
      width: '100%',
      borderRadius: '8px',
    },
    card: {
      height: '120px',
      width: '100%',
      borderRadius: '8px',
    },
  };

  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <ChakraSkeleton
          key={index}
          {...variants[variant]}
          startColor="gray.100"
          endColor="gray.200"
          _dark={{
            startColor: 'dark.bg.tertiary',
            endColor: 'dark.bg.elevated',
          }}
          {...props}
        />
      ))}
    </Stack>
  );
}

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          p={6}
          bg="white"
          borderRadius="8px"
          border="1px solid"
          borderColor="border.light"
          _dark={{
            bg: 'dark.bg.secondary',
            borderColor: 'dark.border.light',
          }}
        >
          <Stack spacing={4}>
            <Skeleton width="40%" height="24px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="60%" height="16px" />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
