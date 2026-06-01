import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const primeThemeAuraPreset = definePreset({
  ...Aura,
  primitive: {
    ...Aura.primitive,
    primary: Aura.primitive?.red,
    surace: Aura.primitive?.gray
  },
  semantic: {
    ...Aura.semantic,
    primary: {
      ...Aura.semantic?.primary,
      color: '{red.500}',    
      hoverColor: '{red.600}',
      activeColor: '{red.700}',
      50: '{red.50}',
      100: '{red.100}',
      200: '{red.200}',
      300: '{red.300}',
      400: '{red.400}',
      500: '{red.500}',
      600: '{red.600}',
      700: '{red.700}',
      800: '{red.800}',
      900: '{red.900}',
      950: '{red.950}'
    }
  }
});


