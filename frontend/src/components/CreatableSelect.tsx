'use client';

import {
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  List,
  ListItem,
  HStack,
  Text,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { HiXMark, HiChevronDown } from 'react-icons/hi2';
import { useRef, useState, useCallback, useEffect } from 'react';

interface CreatableSelectOption {
  label: string;
  value: string;
}

interface CreatableSelectProps {
  label: string;
  options: CreatableSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isRequired?: boolean;
}

export function CreatableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione ou digite',
  isRequired,
}: CreatableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : value || '';

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const isCustomValue =
    inputValue.length > 0 &&
    !options.some(
      (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
    );

  const allItems = [
    ...filteredOptions,
    ...(isCustomValue
      ? [{ label: inputValue, value: inputValue, isCustom: true as const }]
      : []),
  ];

  const openDropdown = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => searchRef.current?.focus(), 0);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setInputValue('');
    setHighlightedIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (itemValue: string) => {
      onChange(itemValue);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange('');
      setInputValue('');
    },
    [onChange]
  );

  const handleTriggerClick = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [isOpen, openDropdown, closeDropdown]);

  const handleInputBlur = useCallback(() => {
    blurTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        closeDropdown();
      }
    }, 150);
  }, [closeDropdown]);

  const handleInputFocus = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < allItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : allItems.length - 1
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(allItems[highlightedIndex].value);
      } else if (e.key === 'Escape') {
        closeDropdown();
      }
    },
    [isOpen, allItems, highlightedIndex, handleSelect, closeDropdown]
  );

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [inputValue]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  return (
    <FormControl isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      <Box ref={containerRef} position="relative">
        <Box
          ref={triggerRef}
          onClick={handleTriggerClick}
          cursor="pointer"
        >
          <Input
            readOnly
            value={isOpen ? inputValue : displayValue}
            placeholder={isOpen ? 'Buscar...' : placeholder}
            cursor="pointer"
            pr="2.5rem"
          />
          <Box
            position="absolute"
            right="10px"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
          >
            {value && !isOpen ? (
              <IconButton
                aria-label="Limpar seleção"
                icon={<HiXMark />}
                size="xs"
                variant="ghost"
                pointerEvents="auto"
                onClick={handleClear}
              />
            ) : (
              <HiChevronDown size={16} />
            )}
          </Box>
        </Box>

        {isOpen && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg="white"
            border="1px solid"
            borderColor="border.light"
            borderRadius="6px"
            boxShadow="md"
            zIndex={1500}
            _dark={{
              bg: 'dark.bg.secondary',
              borderColor: 'dark.border.light',
            }}
          >
            <Box px={3} pt={2} pb={1}>
              <Input
                size="sm"
                placeholder="Buscar..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={searchRef}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
              />
            </Box>
            <List maxH="200px" overflowY="auto" pb={1}>
              {allItems.length === 0 && (
                <ListItem px={3} py={2}>
                  <Text fontSize="sm" color="text.subtle">
                    Nenhum resultado encontrado
                  </Text>
                </ListItem>
              )}
              {allItems.map((item, index) => (
                <ListItem
                  key={item.value}
                  px={3}
                  py={2}
                  cursor="pointer"
                  fontSize="sm"
                  bg={
                    index === highlightedIndex
                      ? 'brand.50'
                      : 'transparent'
                  }
                  _hover={{
                    bg: 'gray.50',
                  }}
                  _dark={{
                    bg:
                      index === highlightedIndex
                        ? 'dark.bg.tertiary'
                        : 'transparent',
                    _hover: {
                      bg: 'dark.bg.tertiary',
                    },
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item.value);
                  }}
                >
                  {'isCustom' in item && item.isCustom ? (
                    <HStack spacing={1}>
                      <Text fontSize="xs" color="text.subtle">
                        +
                      </Text>
                      <Text fontWeight="500">{item.label}</Text>
                      <Text fontSize="xs" color="text.subtle">
                        (criar novo)
                      </Text>
                    </HStack>
                  ) : (
                    <Text>{item.label}</Text>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </FormControl>
  );
}
