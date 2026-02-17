# Auto-Doc Agent (Gemini Edition)

Gemini AI を搭載した自律型ドキュメント生成エージェントです。
ユーザーが指定したトピックについて、Node.jsコードを作成・実行・修正し、動作確認済みのコードを含むMarkdownドキュメントを生成してプレビューします。

## 機能
- **自律エージェント**: 解説文の執筆、コード生成、実行、エラー修正のループを自律的に行います。
- **実行環境**: 生成されたコードはローカルのNode.js環境で実際に実行され、結果が検証されます。
- **UI**: Reactで構築されたリッチなサイドバーUIを提供します。
- **Auto Preview**: 生成完了後、自動的にプレビュー画面が開きます。

## セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. ビルド
```bash
npm run compile
```

### 3. デバッグ実行
F5キーを押して拡張機能をデバッグ実行してください。

## 使い方

1. **Gemini APIキーの設定**
   - [Google AI Studio](https://aistudio.google.com/app/apikey) でAPIキーを取得してください。
   - VS Codeの設定 (`Ctrl+,`) を開き、`autodoc` で検索します。
   - `Auto-doc > Gemini: Api Key` にAPIキーを入力してください。
   - モデルは `gemini-2.0-flash-exp` (デフォルト) が推奨されます。

2. **エージェントの起動**
   - アクティビティバー（左端）にあるGeminiアイコンをクリックします。
   - サイドバーが開きます。

3. **ドキュメント生成**
   - トピックを入力します（例：「Node.jsでフィボナッチ数列を計算する」「ファイルシステムを操作してファイル一覧を取得する」）。
   - 「Start Generation」ボタンをクリックします。
   - ログが表示され、処理が完了するとプレビューが開きます。

## 開発者向け情報

- **ビルドツール**: `esbuild` を使用して `dist/extension.js` (Node) と `dist/Sidebar.js` (Browser) にバンドルされます。
- **UI**: `src/ui/Sidebar.tsx` (React)
- **エージェント**: `src/lib/agent.ts`

## 注意事項
生成されるコードはサンドボックス化されずに実行されます。信頼できる環境でのみ使用してください。
