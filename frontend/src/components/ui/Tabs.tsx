'use client';

import {
  Tabs as ChakraTabs,
  TabsProps as ChakraTabsProps,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
} from '@chakra-ui/react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps extends Omit<ChakraTabsProps, 'children'> {
  tabs: Tab[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export function Tabs({ tabs, defaultIndex = 0, onChange, ...props }: TabsProps) {
  return (
    <ChakraTabs defaultIndex={defaultIndex} onChange={onChange} {...props}>
      <TabList
        borderBottom="1px solid"
        borderColor="border.light"
        _dark={{
          borderColor: 'dark.border.light',
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            fontWeight="500"
            _selected={{
              color: 'brand.500',
              borderColor: 'brand.500',
            }}
            _dark={{
              color: 'dark.text.subtle',
              _selected: {
                color: 'brand.400',
                borderColor: 'brand.400',
              },
            }}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map((tab, index) => (
          <TabPanel key={index} p={0} pt={6}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </ChakraTabs>
  );
}
