// Polyfills for MSW v2 (must be loaded before any MSW imports)
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
// @ts-expect-error - TextDecoder type mismatch
global.TextDecoder = TextDecoder;
