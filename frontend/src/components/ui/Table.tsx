'use client';

import {
  Table as ChakraTable,
  TableProps as ChakraTableProps,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Skeleton,
} from '@chakra-ui/react';

interface TableProps extends ChakraTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
}

interface Column {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export function Table({ 
  columns, 
  data, 
  isLoading = false, 
  emptyMessage = 'Nenhum registro encontrado',
  onRowClick,
  ...props 
}: TableProps) {
  if (isLoading) {
    return (
      <Box overflowX="auto">
        <ChakraTable variant="simple" {...props}>
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column.key} width={column.width} textAlign={column.align}>
                  {column.label}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {[1, 2, 3].map((i) => (
              <Tr key={i}>
                {columns.map((column) => (
                  <Td key={column.key}>
                    <Skeleton height="20px" />
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </ChakraTable>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box 
        p={8} 
        textAlign="center"
        bg="white"
        borderRadius="8px"
        border="1px solid"
        borderColor="border.light"
        _dark={{
          bg: 'dark.bg.secondary',
          borderColor: 'dark.border.light',
        }}
      >
        <Text color="text.subtle">{emptyMessage}</Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <ChakraTable variant="simple" {...props}>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.key} width={column.width} textAlign={column.align}>
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr 
              key={row.id || rowIndex}
              onClick={() => onRowClick?.(row)}
              cursor={onRowClick ? 'pointer' : undefined}
              _hover={onRowClick ? { bg: 'gray.50' } : undefined}
              _dark={onRowClick ? { _hover: { bg: 'dark.bg.tertiary' } } : undefined}
            >
              {columns.map((column) => (
                <Td key={column.key}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </Box>
  );
}
