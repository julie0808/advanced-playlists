import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const primeThemeAuraPreset = definePreset({
  ...Aura,
  primitive: {
    ...Aura.primitive,
    primary: Aura.primitive?.teal,
    surace: Aura.primitive?.gray
  },
  semantic: {
    ...Aura.semantic,
    primary: {
      ...Aura.semantic?.primary,
      color: '{teal.500}',    
      hoverColor: '{teal.600}',
      activeColor: '{teal.700}',
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}'
    }
  }
});


