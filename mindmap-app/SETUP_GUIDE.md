# セットアップガイド - Tailwind CSS v4 & TypeScript verbatimModuleSyntax対応

このガイドは、React + TypeScript + Tailwind CSS v4 + Viteプロジェクトで発生する一般的な問題とその解決方法を説明します。

## 問題と解決方法

### 1. Tailwind CSS v4のPostCSS設定エラー

**エラーメッセージ:**
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
The PostCSS plugin has moved to a separate package...
```

**原因:**
Tailwind CSS v4では、PostCSS統合が別パッケージ`@tailwindcss/postcss`に移動しました。

**解決方法:**

1. 必要なパッケージをインストール:
```bash
npm install @tailwindcss/postcss
```

2. `postcss.config.js`を更新:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 2. TypeScript verbatimModuleSyntax設定による型インポートエラー

**エラーメッセージ:**
```
The requested module '/src/types/index.ts' does not provide an export named 'XXX'
'XXX' は型であり、'verbatimModuleSyntax' が有効であるときは、型のみのインポートを使用してインポートされる必要があります。
```

**原因:**
TypeScriptの`verbatimModuleSyntax`オプションが有効な場合、型のインポートは明示的に`import type`を使用する必要があります。

**解決方法:**

型のインポートを`import type`に変更します。

#### 修正前:
```typescript
import { MindMapNode, MindMap } from '../../types';
import { ReactNode } from 'react';
```

#### 修正後:
```typescript
import type { MindMapNode, MindMap } from '../../types/index';
import type { ReactNode } from 'react';
```

### 3. 修正が必要なファイル一覧

以下のファイルで型インポートを修正する必要があります：

1. **src/context/MindMapContext.tsx**
```typescript
import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { MindMap, MindMapNode, MindMapAction, ViewState } from '../types/index';
```

2. **src/components/Node/Node.tsx**
```typescript
import { useState, useRef, useEffect } from 'react';
import type { MindMapNode } from '../../types/index';
import { useMindMap } from '../../context/MindMapContext';
```

3. **src/components/Connection/Connection.tsx**
```typescript
import type { MindMapNode } from '../../types/index';
```

## 完全なセットアップ手順

### 初回セットアップ

1. **依存関係のインストール:**
```bash
cd mindmap-app
npm install
```

2. **Tailwind CSS v4パッケージのインストール:**
```bash
npm install @tailwindcss/postcss
```

3. **postcss.config.jsの修正:**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

4. **型インポートの修正:**
以下のコマンドで型インポートを使用しているファイルを検索:
```bash
# Git Bash / Linux / Mac
grep -r "import.*from.*types" src/**/*.tsx
```

各ファイルで型インポートを`import type`形式に変更します。

5. **開発サーバーの起動:**
```bash
npm run dev
```

6. **ブラウザで確認:**
```
http://localhost:5173
```

## 適用済みの修正内容

このプロジェクトでは以下の修正が既に適用されています：

✅ `@tailwindcss/postcss`パッケージがインストール済み
✅ `postcss.config.js`が Tailwind CSS v4 対応に更新済み
✅ 全ての型インポートが`import type`に修正済み
✅ 型インポートパスが明示的に`/index`を指定するように更新済み

## トラブルシューティング

### エラーが解消されない場合

1. **node_modulesを削除して再インストール:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Viteのキャッシュをクリア:**
```bash
rm -rf .vite
npm run dev
```

3. **ブラウザのキャッシュをクリア:**
開発者ツール（F12）を開き、ネットワークタブで「キャッシュの無効化」を有効にしてリロード

### ESLint警告について

```
Fast refresh only works when a file only exports components.
```

この警告は開発時のHMR（Hot Module Replacement）に関するもので、アプリケーションの実行には影響しません。警告を解消したい場合は、コンポーネントとユーティリティ関数を別ファイルに分離してください。

## 参考リンク

- [Tailwind CSS v4 PostCSS Plugin](https://tailwindcss.com/docs/installation/using-postcss)
- [TypeScript verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [Vite Configuration](https://vitejs.dev/config/)

---

**最終更新**: 2025-11-17
**適用コミット**: 7192f68
