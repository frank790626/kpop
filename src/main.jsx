import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 自架字體（@fontsource），不依賴外部 CDN；都是可變字體，一個檔涵蓋所有字重
import '@fontsource-variable/unbounded';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/noto-sans-tc';

import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
