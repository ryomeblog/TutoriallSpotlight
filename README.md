# TutorialSpotlight Library

## 概要

TutorialSpotlightは、Webアプリケーション上でユーザーに対してインタラクティブなチュートリアルやガイドを表示するためのReactコンポーネントライブラリです。  
特定のUI要素を強調表示（スポットライト）し、説明パネルやステップナビゲーションを提供します。  
TutorialManagerは、チュートリアルの進捗管理や表示制御を補助するユーティリティです。

## 主な特徴

- 任意のReact要素をスポットライトで強調
- ステップごとに説明パネルを表示
- パネルの位置・サイズ・表示方法を柔軟に指定可能
- ステップごとにスクロール・フォーカス制御
- ダミーグラフや任意のコンテンツをパネル内に表示可能
- チュートリアル進捗の管理・リセット機能（TutorialManager）

---

## インストール

```bash
npm install tutorial-spotlight
```

---

## 基本的な使い方

### 1. チュートリアルステップの定義

```jsx
import React, { useRef } from 'react';
import TutorialSpotlight from 'tutorial-spotlight';

const stepRefs = [useRef(), useRef(), useRef()];

const steps = [
  {
    key: 'step1',
    label: 'ダッシュボードの使い方',
    desc: 'ここではダッシュボードの概要を説明します。',
    targetRef: stepRefs[0],
    panelSide: 'right', // パネルの表示位置
  },
  {
    key: 'step2',
    label: '取引の追加',
    desc: '取引追加ボタンをクリックしてみましょう。',
    targetRef: stepRefs[1],
    panelSide: 'bottom',
  },
  // ...他のステップ
];
```

### 2. TutorialSpotlightの配置

```jsx
const [visible, setVisible] = useState(true);
const [step, setStep] = useState(0);

<TutorialSpotlight
  steps={steps}
  step={step}
  visible={visible}
  onNext={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
  onClose={() => setVisible(false)}
>
  {/* アプリ本体のUI */}
  <div ref={stepRefs[0]}>ダッシュボード</div>
  <button ref={stepRefs[1]}>取引追加</button>
</TutorialSpotlight>;
```

---

## APIリファレンス

### `<TutorialSpotlight />` Props

| 名前     | 型      | 説明                                                                          |
| -------- | ------- | ----------------------------------------------------------------------------- |
| steps    | array   | チュートリアルステップの配列。各ステップはkey, label, desc, targetRef等を持つ |
| step     | number  | 現在表示中のステップ番号                                                      |
| visible  | boolean | チュートリアルの表示/非表示                                                   |
| onNext   | func    | 「次へ」ボタン押下時のコールバック                                            |
| onClose  | func    | チュートリアル終了時のコールバック                                            |
| children | node    | スポットライト対象を含むアプリ本体のUI                                        |

#### ステップオブジェクト例

```js
{
  key: 'step1',
  label: 'タイトル',
  desc: '説明文',
  targetRef: ref, // React.createRef()またはuseRef()
  panelSide: 'right'|'left'|'top'|'bottom', // パネルの表示位置
  panelWidth: 320, // パネルの幅
  panelHeight: 140, // パネルの高さ
  panelInitialPos: { top: 100, left: 200 }, // パネルの初期位置
  dummyGraphComponent: <DummyGraph />, // 任意のReact要素
}
```

---

### `<TutorialManager />`（オプション）

- チュートリアルの進捗状態を管理
- 各画面ごとに「完了/未完了」をトグル
- すべてリセットボタンあり

#### 使い方

```jsx
import TutorialManager from 'tutorial-spotlight/TutorialManager';

<TutorialManager />;
```

---

## カスタマイズ

- パネルのドラッグ移動
- クローン表示の有無（data-spotlight-no-clone属性で制御）
- スポットライト枠の色・影・角丸の調整
- ステップごとに任意のコンテンツ挿入

---

## 注意事項

- targetRefは必ずReactのrefオブジェクトを指定してください
- スポットライト対象要素が非表示の場合は正しく動作しません
- ステップ切り替え時にスクロール位置が自動調整されます

---

## ライセンス

MIT

---

## 今後の拡張予定

- 多言語対応
- モバイル最適化
- ステップ分岐・条件分岐
- 外部設定ファイルによるチュートリアル定義

---

## コントリビュート

Pull Request・Issue歓迎です！
