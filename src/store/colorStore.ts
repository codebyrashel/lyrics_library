import { globalColors } from '@/constants/colors';
import { ColorPalette } from '@/types/colors';

let colorStore: ColorPalette = globalColors;

export const getColors = (): ColorPalette => {
  return colorStore;
};

export const updateColors = (newColors: Partial<ColorPalette>): void => {
  colorStore = { ...colorStore, ...newColors };
};

export default colorStore;