import { ThemePalette } from '@angular/material/core';
import { Pattern } from './patterns/pattern.interface';

export interface ChipToken {
    name: string;
    pattern: Pattern;
    color?: ThemePalette;
}