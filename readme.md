# キャンパスナビ（地図案内アプリケーション）

## 概要

キャンパスナビは、大学キャンパス内の建物や教室を検索し、目的地までのナビゲーションを提供するWebアプリケーションです。Unity WebGLによる3Dマップ表示と、ReactによるUIで構成されています。スマートフォン・PC両対応です。

↓アクセスはこちらから(ロードに時間がかかるため注意)<br>
https://r-navi.math.ryukoku.ac.jp/

---

## 主な機能

- 建物・教室の検索
- 現在地の取得と表示（ブラウザの位置情報API利用）
- 目的地までの経路案内（Unity WebGL連携）
- 2D/3Dマップ切り替え
- 歩きスマホ注意ポップアップ
- ダークモード対応

---

## ディレクトリ構成

```
src/
  components/         ... Reactコンポーネント群
    HomeScreen.tsx    ... ホーム画面
    NavigationScreen.tsx ... 案内画面
    SearchScreen.tsx  ... 検索画面
    Unity.tsx         ... Unity WebGL埋め込み
    GetLocation.tsx   ... 位置情報取得
    GetDirection.tsx  ... 方位取得
    ErrorPopup.tsx    ... エラーポップアップ
    WalkingPhoneAlert.tsx ... 歩きスマホ注意
    ...
  search/             ... 検索関連コンポーネント
  ui/                 ... UIパーツ
  assets/             ... 画像等アセット
  CSS/                ... スタイル
public/
  Build/              ... Unity WebGLビルドファイル
```

---

## セットアップ方法

1. 依存パッケージのインストール

   ```
   npm install
   ```

2. 開発サーバーの起動

   ```
   npm run dev
   ```

3. ブラウザで `http://localhost:5173` などにアクセス

---

## 技術スタック

- React (TypeScript)
- Vite
- Unity WebGL
- Tailwind CSS

---

## 注意事項

- 位置情報取得にはブラウザの許可が必要です。
- Unity WebGLの動作にはWebGL対応ブラウザが必要です。
- サーバーAPI（建物・教室情報取得）は `http://100.104.15.110:8080` を参照しています。

---

## デザイン参考

[Figmaデザインはこちら](https://www.figma.com/make/QKSznfg2cPJWVRDoGVEqf9/%E5%9C%B0%E5%9B%B3%E6%A1%88%E5%86%85%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3?fullscreen=1)