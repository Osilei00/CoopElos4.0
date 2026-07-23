'use client';

import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatCard({ 
  label, 
  value, 
  icon: Icon,
  trend,
  color = 'brand.500'
}: StatCardProps) {
  return (
    <Box
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
      <Flex justifyContent="space-between" alignItems="flex-start">
        <VStack spacing={2} align="flex-start">
          <Text 
            fontSize="sm" 
            color="text.subtle"
          >
            {label}
          </Text>
          <Text 
            fontSize="2xl" 
            fontWeight="600"
            color="text.primary"
            fontFamily="mono"
          >
            {value}
          </Text>
          {trend && (
            <Text 
              fontSize="xs" 
              color={trend.isPositive ? 'success.500' : 'danger.500'}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Text>
          )}
        </VStack>
        
        {Icon && (
          <Box
            p={3}
            bg={`${color.split('.')[0]}.50`}
            borderRadius="8px"
            _dark={{
              bg: `${color.split('.')[0]}.900`,
            }}
          >
            <Icon size={20} color={color} />
          </Box>
        )}
      </Flex>
    </Box>
  );
}

// Import for VStack used in StatCard
import { VStack } from '@chakra-ui/react';
