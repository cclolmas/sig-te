// Adiciona matchers do jest-dom, como .toBeInTheDocument()
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;