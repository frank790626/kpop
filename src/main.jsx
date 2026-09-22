import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// 自架字體（@fontsource），不依賴外部 CDN；都是可變字體，一個檔涵蓋所有字重
import '@fontsource-variable/unbounded';      // 標題
import '@fontsource-variable/geist';          // 內文與 UI（拉丁字母、數字）
import '@fontsource-variable/noto-sans-tc';   // 中文
import '@fontsource-variable/noto-sans-kr';   // 韓文（成員的韓文名）

import './styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
