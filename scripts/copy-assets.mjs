// 把 assets/img（成員照片）複製進 build 產物。
// 照片放在 repo 根目錄的 assets/img/，這樣用 GitHub 網頁介面上傳最直覺。
import { cp, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const from = 'assets/img';
const to = 'dist/assets/img';

if (existsSync(from)) {
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
  console.log(`copied ${from} → ${to}`);
}
