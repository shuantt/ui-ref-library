# UI Reference Library

> 本專案 fork 自 [joshhu/uitest](https://github.com/joshhu/uitest)，以原有的 57 個 HTML 樣板為基礎，整理成用於設計討論、風格提案與 AI 協作的個人 UI 參考庫。

![UI Styles](https://img.shields.io/badge/Styles-57-blue)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-CDN-38B2AC)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/license/mit)

## 本 fork 的調整

- 修正樣板內的錯置文字、缺漏內容與錯誤路徑。
- 補齊風格型頁面的按鈕、表單、狀態與互動元件示意。
- 建立共用 RWD 安全基線，改善手機版水平溢位與版面跑版。
- 在首頁每張卡片加入「風格說明」與可複製的「AI Prompt」。
- 區分視覺風格、Landing Page 模式、資料介面與產品設計模式，避免把功能類型誤認為視覺風格。
- 新增完整性與 RWD 自動檢查，驗證 57 個頁面、首頁卡片、連結與操作。

## 專案定位

這是一套持續擴充的個人參考庫，不是 UI 風格的完整清單，也不是 Foundry OS 的風格白名單。

在 Foundry OS 的工作流中，它可以提供具體的風格示意、元件語彙與 Prompt，協助 AI 理解偏好的方向；實際提案仍應結合專案需求、本庫以外的設計知識與新的設計可能，整理出適合客戶討論的方案。

## 如何使用

開啟 `index.html` 後，可以瀏覽全部 57 個參考頁面。首頁每張卡片包含：

- **查看頁面**：開啟完整的風格或產品模式示意。
- **風格說明**：了解視覺特色、常見元素與適用情境。
- **AI Prompt**：複製生成提示，再替換產品、任務、內容與技術棧。

## 內容索引

### General Styles（01–19）

| # | 名稱 | 重點 |
|---|---|---|
| 01 | Minimalism & Swiss Style | 極簡、功能性與瑞士網格 |
| 02 | Neumorphism | 柔和陰影與凸起效果 |
| 03 | Glassmorphism | 毛玻璃、透明與景深 |
| 04 | Brutalism | 原始、高對比與反設計語彙 |
| 05 | 3D & Hyperrealism | 擬真材質、景深與沉浸感 |
| 06 | Vibrant & Block-based | 高彩度、大色塊與活力構圖 |
| 07 | Dark Mode (OLED) | 純黑背景與高亮重點色 |
| 08 | Accessible & Ethical | 高對比、鍵盤操作與可讀性 |
| 09 | Claymorphism | 圓潤的黏土 3D 質感 |
| 10 | Aurora UI | 極光漸層與流動色彩 |
| 11 | Retro-Futurism | 復古科技與未來想像 |
| 12 | Flat Design | 乾淨色塊與扁平層次 |
| 13 | Skeuomorphism | 仿真材質與實體隱喻 |
| 14 | Liquid Glass | 流動玻璃、形變與虹彩 |
| 15 | Motion-Driven | 以動態與轉場建立層次 |
| 16 | Micro-interactions | 狀態回饋與細節互動 |
| 17 | Inclusive Design | 通用設計與多感官體驗 |
| 18 | Zero Interface | 語音、環境感知與隱形介面 |
| 19 | Soft UI Evolution | 提升對比後的柔和 UI |

### Landing Page Patterns（20–27）

| # | 名稱 | 重點 |
|---|---|---|
| 20 | Hero-Centric | 以主視覺與核心訊息開場 |
| 21 | Conversion-Optimized | 表單聚焦與單一主要行動 |
| 22 | Feature-Rich Showcase | 多功能展示與網格資訊架構 |
| 23 | Minimal & Direct | 大量留白與直接訊息 |
| 24 | Social Proof-Focused | 客戶評價、數據與案例佐證 |
| 25 | Interactive Demo | 互動式產品展示 |
| 26 | Trust & Authority | 信任感與權威設計 |
| 27 | Storytelling | 故事敘事型設計 |

### BI / Analytics Patterns（28–37）

| # | 名稱 | 重點 |
|---|---|---|
| 28 | Data-Dense Dashboard | 高密度數據儀表板 |
| 29 | Heatmap & Density | 熱力圖與密度視覺化 |
| 30 | Executive Summary Dashboard | 高管摘要報表 |
| 31 | Real-time Monitoring | 即時監控儀表板 |
| 32 | Drill-Down Analytics | 層級式數據探索 |
| 33 | Comparative Analytics | 跨期間與基準比較 |
| 34 | Predictive Analytics | AI 預測分析 |
| 35 | User Behavior Analytics | 使用者行為分析 |
| 36 | Financial Dashboard | 財務、預算與投資分析 |
| 37 | Sales Intelligence | 銷售智慧儀表板 |

### Modern Styles & Systems（38–57）

| # | 名稱 | 重點 |
|---|---|---|
| 38 | Neubrutalism | 粗框、高對比與直接層級 |
| 39 | Bento Box Grid | 便當盒非對稱網格 |
| 40 | Y2K Revival | 千禧年數位復古 |
| 41 | Cyberpunk | 霓虹、科技與反烏托邦 |
| 42 | Organic / Biophilic | 有機形狀與自然語彙 |
| 43 | AI-Native UI | 工具動作、來源與串流狀態 |
| 44 | Memphis Revival | 幾何、撞色與 80s 趣味 |
| 45 | Vaporwave | 夢幻漸層與網路懷舊 |
| 46 | Dimensional Layering | 多層次景深設計 |
| 47 | Exaggerated Minimalism | 巨型字體與極端留白 |
| 48 | Kinetic Typography | 動態字體與節奏 |
| 49 | Parallax Storytelling | 視差滾動敘事 |
| 50 | Swiss Modernism 2.0 | 當代瑞士網格與排版 |
| 51 | HUD / Sci-Fi Interface | 科幻 HUD 與高密度資訊 |
| 52 | Pixel Art / Retro Gaming | 像素與復古遊戲語彙 |
| 53 | Bento Grids | 模組化便當格系統 |
| 54 | Neubrutalism Component System | 新野獸派元件與表單系統 |
| 55 | Spatial UI | 空間運算與景深介面 |
| 56 | E-Ink / Paper | 電子墨水與紙張質感 |
| 57 | Gen Z Chaos | 拼貼、混搭與反秩序構圖 |

## 本地使用

```bash
git clone https://github.com/shuantt/ui-ref-library.git
cd ui-ref-library
```

這是純靜態 HTML 專案，不需安裝套件或執行建置流程，直接以瀏覽器開啟 `index.html` 即可。

## 專案結構

```text
ui-ref-library/
├── index.html                 # 首頁索引
├── README.md                  # 專案說明
├── scripts/
│   ├── check-library.mjs      # 內容與連結完整性檢查
│   ├── check-rwd.mjs          # RWD 與首頁互動檢查
│   └── style-card-guides.js   # 風格說明、Prompt 與對話框互動
└── styles/
    ├── responsive.css         # 共用手機版安全基線
    ├── 01-minimalism.html
    ├── ...
    └── 57-gen-z-chaos.html
```

## 自動檢查

```bash
# 連結、標題、頁碼、metadata 與基本結構
node scripts/check-library.mjs

# 手機版水平溢位與首頁卡片操作
node scripts/check-rwd.mjs --width=375

# 桌面版回歸
node scripts/check-rwd.mjs --width=1280
```

RWD 檢查需要本機安裝 Chrome 或 Edge。若要保存指定頁面的完整截圖，可加上：

```bash
node scripts/check-rwd.mjs --width=375 --capture=47-exaggerated-minimalism.html --capture-dir=./rwd-captures
```

## 來源、授權與致謝

本專案延伸自 [joshhu/uitest](https://github.com/joshhu/uitest)，原始樣板由 [joshhu](https://github.com/joshhu) 建立，並以 [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) skill 作為設計參考。上游採用 MIT License；本專案依其條款使用與修改，並保留原作者及授權資訊。
