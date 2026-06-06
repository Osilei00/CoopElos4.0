import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#2563eb',
      600: '#1d4ed8',
      700: '#1e40af',
      800: '#1e3a8a',
      900: '#1e3a5f',
    },
    success: {
      50: '#ecfdf5',
      500: '#059669',
      600: '#047857',
    },
    danger: {
      50: '#fef2f2',
      500: '#dc2626',
      600: '#b91c1c',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      subtle: '#6b7280',
    },
    border: {
      light: '#e5e7eb',
    },
    dark: {
      bg: {
        primary: '#0f1117',
        secondary: '#1a1d27',
        tertiary: '#252836',
        elevated: '#2d3040',
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        subtle: '#94a3b8',
      },
      border: {
        light: '#334155',
        medium: '#475569',
      },
    },
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'dark.bg.primary' : '#f9fafb',
        color: props.colorMode === 'dark' ? 'dark.text.primary' : '#374151',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: (props: { colorMode: string }) => ({
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
          _dark: {
            bg: 'brand.600',
            _hover: {
              bg: 'brand.700',
            },
          },
        }),
        outline: (props: { colorMode: string }) => ({
          border: '1px solid',
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
          _dark: {
            borderColor: 'brand.400',
            color: 'brand.400',
            _hover: {
              bg: 'brand.900',
            },
          },
        }),
        ghost: (props: { colorMode: string }) => ({
          _hover: {
            bg: 'gray.100',
          },
          _dark: {
            _hover: {
              bg: 'dark.bg.tertiary',
            },
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: { colorMode: string }) => ({
        container: {
          bg: 'white',
          borderRadius: '8px',
          boxShadow: 'sm',
          border: '1px solid',
          borderColor: 'border.light',
          _dark: {
            bg: 'dark.bg.secondary',
            borderColor: 'dark.border.light',
          },
        },
      }),
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            borderRadius: '6px',
            bg: 'white',
            _dark: {
              bg: 'dark.bg.tertiary',
              borderColor: 'dark.border.light',
              color: 'dark.text.primary',
            },
            _focus: {
              boxShadow: '0 0 0 1px #2563eb',
              _dark: {
                boxShadow: '0 0 0 1px #60a5fa',
              },
            },
          },
        }),
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      variants: {
        outline: (props: { colorMode: string }) => ({
          field: {
            borderRadius: '6px',
            bg: 'white',
            _dark: {
              bg: 'dark.bg.tertiary',
              borderColor: 'dark.border.light',
              color: 'dark.text.primary',
            },
          },
        }),
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
      variants: {
        outline: (props: { colorMode: string }) => ({
          borderRadius: '6px',
          bg: 'white',
          _dark: {
            bg: 'dark.bg.tertiary',
            borderColor: 'dark.border.light',
            color: 'dark.text.primary',
          },
        }),
      },
    },
    Table: {
      variants: {
        simple: (props: { colorMode: string }) => ({
          th: {
            bg: '#f9fafb',
            color: 'text.secondary',
            fontWeight: '600',
            fontSize: 'sm',
            _dark: {
              bg: 'dark.bg.tertiary',
              color: 'dark.text.secondary',
              borderColor: 'dark.border.light',
            },
          },
          td: {
            borderColor: 'border.light',
            _dark: {
              borderColor: 'dark.border.light',
              color: 'dark.text.primary',
            },
          },
          tr: {
            _dark: {
              _hover: {
                bg: 'dark.bg.tertiary',
              },
            },
          },
        }),
      },
    },
    Menu: {
      baseStyle: (props: { colorMode: string }) => ({
        list: {
          bg: 'white',
          borderColor: 'border.light',
          _dark: {
            bg: 'dark.bg.secondary',
            borderColor: 'dark.border.light',
          },
        },
        item: {
          _hover: {
            bg: 'gray.100',
          },
          _dark: {
            _hover: {
              bg: 'dark.bg.tertiary',
            },
          },
        },
      }),
    },
    Modal: {
      baseStyle: (props: { colorMode: string }) => ({
        dialog: {
          bg: 'white',
          _dark: {
            bg: 'dark.bg.secondary',
          },
        },
        header: {
          _dark: {
            color: 'dark.text.primary',
          },
        },
        body: {
          _dark: {
            color: 'dark.text.secondary',
          },
        },
      }),
    },
    Drawer: {
      baseStyle: (props: { colorMode: string }) => ({
        dialog: {
          bg: 'white',
          _dark: {
            bg: 'dark.bg.secondary',
          },
        },
      }),
    },
    Tabs: {
      variants: {
        line: (props: { colorMode: string }) => ({
          tab: {
            _dark: {
              color: 'dark.text.subtle',
              _selected: {
                color: 'brand.400',
                borderColor: 'brand.400',
              },
            },
          },
          tablist: {
            _dark: {
              borderColor: 'dark.border.light',
            },
          },
        }),
      },
    },
    Badge: {
      baseStyle: (props: { colorMode: string }) => ({
        _dark: {
          bg: 'dark.bg.tertiary',
          color: 'dark.text.secondary',
        },
      }),
    },
    Tooltip: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: 'gray.700',
        color: 'white',
        _dark: {
          bg: 'dark.bg.elevated',
          color: 'dark.text.primary',
        },
      }),
    },
  },
});

export default theme;
