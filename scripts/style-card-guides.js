(() => {
    const guideDefinitions = [
        ["styles/01-minimalism.html", "Minimalism & Swiss Style", "視覺風格", "以嚴格網格、充足留白、客觀排版與高對比建立秩序；裝飾極少，每個元素都必須服務資訊。", "編輯內容、設計工作室、文件工具與重視清晰度的產品。", "使用 Swiss grid、無襯線字、黑白中性色與單一紅或藍色重點；對齊精準、層級明確、避免多餘陰影與裝飾。"],
        ["styles/02-neumorphism.html", "Neumorphism", "視覺風格", "元件像從同色背景浮起或壓入，透過一明一暗的柔和陰影形成觸感；整體安靜、低對比。", "少量控制元件、音樂播放器、健康或智慧家庭介面；不適合高密度資料。", "使用同色背景與雙向柔和陰影、圓角和內凹／外凸狀態；文字與重要操作維持足夠對比，不讓陰影成為唯一狀態提示。"],
        ["styles/03-glassmorphism.html", "Glassmorphism", "視覺風格", "半透明面板、背景模糊、細亮邊框與層疊光影，讓內容像浮在有景深的玻璃上。", "音樂、旅遊、創意工具、登入頁與具有影像背景的產品。", "使用 15–30% 半透明表面、backdrop blur、細亮邊框和清楚的前後景；控制玻璃層數並以實色底確保文字對比。"],
        ["styles/04-brutalism.html", "Brutalism", "視覺風格", "刻意保留原始網頁感：粗框、強烈對比、不對稱排版與直接文字，不追求柔順或精緻裝飾。", "文化活動、藝術組織、實驗品牌與需要鮮明態度的專案。", "使用純色、高反差、粗邊框、硬切版面與大型排版；可不對稱但閱讀順序必須清楚，避免為反設計犧牲操作性。"],
        ["styles/05-3d-hyperrealism.html", "3D & Hyperrealism", "視覺風格", "以立體物件、真實材質、光照、反射與多層陰影營造可觸摸的沉浸感。", "高階產品展示、遊戲、建築、汽車與需要視覺衝擊的品牌頁。", "建立明確主體、真實材質與一致光源，使用多層景深和受控反射；先保證內容可讀，再加入 3D，並提供低效能與 reduced-motion fallback。"],
        ["styles/06-vibrant-block.html", "Vibrant & Block-based", "視覺風格", "用高飽和色塊、粗體字與模組化區塊快速建立節奏，活潑但仍依賴清楚的資訊分區。", "創意工具、教育、活動、年輕品牌與內容入口頁。", "使用 3–5 個高飽和色、粗體標題、清楚區塊與簡單幾何；相鄰色塊需維持文字對比，避免每個區域都搶主角。"],
        ["styles/07-dark-mode-oled.html", "Dark Mode (OLED)", "視覺風格", "以接近純黑的背景降低發光面積，搭配少量高亮資訊與細微層級，適合長時間觀看。", "媒體播放器、監控工具、夜間使用情境與行動裝置。", "以 #000 或極深色為主，使用低面積彩色重點、清楚的表面層級與無光暈文字；避免大面積純白並單獨檢查暗色對比。"],
        ["styles/08-accessible.html", "Accessible & Ethical", "設計原則", "這不是單一視覺風格，而是把可讀性、鍵盤操作、語意結構、包容性文案與公平使用放在造型之前。", "政府、醫療、金融、教育與所有需要服務廣泛使用者的產品。", "從 WCAG AA、語意 HTML、可見焦點、鍵盤流程、替代文字、非色彩唯一提示與清楚錯誤復原開始；視覺風格可另行選擇。"],
        ["styles/09-claymorphism.html", "Claymorphism", "視覺風格", "厚實圓潤的黏土物件、柔和立體陰影與玩具般配色，表面有體積但不追求寫實材質。", "兒童、教育、健康、遊戲化任務與友善品牌。", "使用飽滿圓角、內外雙陰影、柔和彩色表面與簡化 3D 圖形；控制陰影層數並讓文字區保持平整清楚。"],
        ["styles/10-aurora-ui.html", "Aurora UI", "視覺風格", "深色或柔暗背景上疊加大型模糊漸層光團，像極光般形成氣氛與視線引導。", "AI、音樂、創意軟體、品牌首頁與科技活動。", "使用 2–4 個大尺度模糊光團、深色基底、半透明表面與有限動態；避免漸層穿過小字，重要內容需有穩定實色承托。"],
        ["styles/11-retro-futurism.html", "Retro-Futurism", "視覺風格", "把過去想像的未來重新組合：CRT、網格地平線、鉻字、終端介面與類比科技符號。", "音樂、遊戲、展演、影視宣傳與實驗品牌。", "融合 70–90 年代科技語彙、單色顯示器、幾何網格、有限霓虹與復古字型；選定一個年代主軸，避免所有懷舊元素同時堆疊。"],
        ["styles/12-flat-design.html", "Flat Design", "視覺風格", "以純色、簡單圖形與清楚輪廓表達功能，不依賴質感、反射或立體陰影。", "跨平台工具、教育、圖示系統與需要快速載入的產品。", "使用純色表面、清楚的色彩角色、簡化 SVG 圖示與 2D 層級；互動狀態靠色彩、邊框和排版表達，不加入擬物陰影。"],
        ["styles/13-skeuomorphism.html", "Skeuomorphism", "視覺風格", "借用真實物件的材質、控制方式與視覺線索，讓數位功能看起來熟悉且可操作。", "音樂設備、復古工具、模擬器與具有具體實體隱喻的產品。", "選擇一個可信的實體物件作為隱喻，統一材質、光源、刻度與控制回饋；保留語意標籤，不讓裝飾掩蓋操作。"],
        ["styles/14-liquid-glass.html", "Liquid Glass", "視覺風格", "玻璃表面帶有液態曲線、折射、虹彩與柔和變形，視覺更有流動性與未來感。", "高階消費產品、音樂、時尚、實驗型工具與品牌展示。", "使用有機玻璃輪廓、受控折射、虹彩高光與流動形變；保持主要內容區穩定，提供 reduced-motion，避免過度模糊造成低對比。"],
        ["styles/15-motion-driven.html", "Motion-Driven", "互動方向", "介面的資訊層級與因果關係主要透過轉場、滾動與物件連續性表達，而非把動畫當裝飾。", "產品敘事、作品集、教學流程與需要解釋變化的體驗。", "先建立靜態可用版，再以 transform/opacity、共享元素與短轉場說明狀態變化；動畫可中斷並完整支援 prefers-reduced-motion。"],
        ["styles/16-micro-interactions.html", "Micro-interactions", "互動模式", "針對單一任務提供細小但即時的回饋，例如按壓、儲存、切換、成功與錯誤狀態。", "表單、設定、任務工具、商務產品與高頻操作。", "為每個關鍵操作設計 100–300ms 的 hover、press、loading、success 和 error 回饋；不改變元件尺寸，不阻擋輸入，並搭配文字或圖示。"],
        ["styles/17-inclusive-design.html", "Inclusive Design", "設計原則", "把不同能力、語言、年齡、裝置與使用情境納入產品決策，而不是完成後才補無障礙。", "公共服務、協作工具、醫療、教育與全球化產品。", "提供多種輸入／輸出方式、彈性文字尺寸、清楚語言、寬容錯誤與不依賴單一感官的回饋；先描述使用者差異再決定視覺風格。"],
        ["styles/18-zero-interface.html", "Zero Interface", "互動典範", "減少持續可見的畫面控制，改由語音、感測、情境推論與自動化完成任務。", "智慧家庭、穿戴裝置、助理、車載與環境運算。", "以情境觸發、語音或自然輸入完成核心任務，同時提供可見確認、取消、權限與人工替代路徑；不可讓 AI 決策變成黑箱。"],
        ["styles/19-soft-ui-evolution.html", "Soft UI Evolution", "視覺風格", "保留柔和表面、圓角與細膩陰影，但提高邊界、文字和狀態對比，修正傳統 Neumorphism 的可用性問題。", "健康、金融、生活服務與溫和品牌的工具介面。", "使用柔和中性色、有限浮雕、清楚邊框與可見焦點；主要操作採實色，disabled/error 不只靠陰影差異。"],
        ["styles/20-hero-centric.html", "Hero-Centric Design", "Landing 模式", "首屏以單一大型主視覺、明確價值主張與主要行動集中注意力，後續內容從核心訊息展開。", "新品發表、品牌活動、單一服務與高視覺產品。", "建立一個主標題、一段價值說明、一個主要 CTA 與一個支撐視覺；首屏不要塞滿功能，行動與內容在手機版仍需先出現。"],
        ["styles/21-conversion-optimized.html", "Conversion-Optimized", "Landing 模式", "以降低決策摩擦為目標，將單一 CTA、利益、信任證據與簡短表單安排在清楚的轉換路徑。", "註冊、預約、下載、詢價與訂閱頁。", "先定義唯一轉換目標，使用利益導向標題、短表單、就近錯誤、信任資訊與重複 CTA；避免假倒數、暗黑模式和過度催促。"],
        ["styles/22-feature-rich.html", "Feature-Rich Showcase", "Landing 模式", "用模組化網格、分群與逐步揭露呈現多項能力，讓複雜產品仍能快速掃讀。", "SaaS 平台、企業軟體、開發工具與多功能產品。", "先以 3–5 個能力群組建立總覽，再用卡片、截圖與短文展開；加入比較與導覽錨點，避免平鋪所有功能造成認知過載。"],
        ["styles/23-minimal-direct.html", "Minimal & Direct", "Landing 模式", "用極少內容直接回答產品是什麼、給誰用與下一步，依靠留白和文字層級建立信心。", "新創 MVP、顧問服務、個人工具與單一功能產品。", "只保留核心價值、主要 CTA、必要證據與簡短使用方式；使用寬鬆留白和高對比文字，不用無關裝飾填滿頁面。"],
        ["styles/24-social-proof.html", "Social Proof-Focused", "Landing 模式", "讓客戶評價、案例成果、使用數據與品牌證據成為主要說服結構，而不是頁尾附屬內容。", "B2B、顧問、課程、服務與高信任門檻產品。", "使用可驗證姓名／角色、具體前後成果、案例摘要與合理數據；標示來源，不製造虛假 logo 或匿名誇張評價。"],
        ["styles/25-interactive-demo.html", "Interactive Product Demo", "Landing 模式", "在行銷頁直接提供安全、可理解的產品操作片段，讓使用者先體驗再決定註冊。", "AI 工具、編輯器、開發平台與互動服務。", "建立有引導的 3–5 步 demo、預填範例、重設與跳過選項；限制資料範圍並提供靜態替代，不把整個正式產品硬塞進首頁。"],
        ["styles/26-trust-authority.html", "Trust & Authority", "Landing 模式", "透過制度、資格、透明流程、專業內容與安全說明建立可信度，視覺語氣穩定克制。", "醫療、金融、法律、資安與高風險企業服務。", "使用清楚組織資訊、可查證認證、方法說明、安全與隱私入口；採保守色彩和嚴謹排版，不虛構徽章或用空泛權威文案。"],
        ["styles/27-storytelling.html", "Storytelling-Driven", "Landing 模式", "依時間、衝突、轉折與成果安排內容，讓使用者沿著一條情緒與資訊曲線理解產品。", "品牌故事、公益、作品集、產品發表與文化專案。", "用開場情境、問題、探索、解法與結果組成章節；每段只推進一個訊息，搭配真實素材和清楚 CTA，不讓敘事遮蔽產品資訊。"],
        ["styles/28-data-dense-dashboard.html", "Data-Dense Dashboard", "Data & System 模式", "在單一工作面集中大量 KPI、圖表、表格與篩選，重點是密度可控、比較快速與操作穩定。", "營運中心、分析師、內部管理與多指標監控。", "使用緊湊但一致的網格、tabular numbers、固定篩選區、可排序表格與清楚分區；支援欄位選擇、空／載入／錯誤狀態及小螢幕降維。"],
        ["styles/29-heatmap-density.html", "Heatmap & Density", "Data & System 模式", "以色階或密度快速呈現大量位置、時間或矩陣資料中的群聚與異常。", "行為分析、資源使用、地理分布、排程與相關性矩陣。", "建立有單位的連續色階、圖例、精確 tooltip、鍵盤可達資料與表格替代；不可只靠紅綠判斷，缺值必須另行標示。"],
        ["styles/30-executive-summary.html", "Executive Summary Dashboard", "Data & System 模式", "把高層真正需要的少量成果、趨勢、風險與待決策事項放在第一層，細節延後。", "主管週報、董事會、投資人更新與跨部門營運摘要。", "首屏只放 4–6 個關鍵指標、同比／環比、目標差距與一句洞察；標示更新時間和資料來源，提供細節連結而非堆滿圖表。"],
        ["styles/31-real-time-monitoring.html", "Real-Time Monitoring", "Data & System 模式", "持續顯示系統狀態、事件流、延遲與告警，要求快速辨識異常並能立即採取行動。", "基礎設施、製造、物流、資安、客服與現場運營。", "使用清楚健康狀態、最後更新時間、告警層級、事件時間軸和確認／靜音操作；避免無意義動畫，斷線與資料延遲必須明示。"],
        ["styles/32-drill-down-analytics.html", "Drill-Down Analytics", "Data & System 模式", "從總覽逐層進入區域、類別、個體或事件，讓使用者保留上下文並找到原因。", "營運分析、銷售、產品數據與異常調查。", "建立總覽→維度→明細的層級、breadcrumb、保留篩選與可返回路徑；每層提供摘要和精確資料，不用無法撤回的圖表點擊。"],
        ["styles/33-comparative-analytics.html", "Comparative Analytics", "Data & System 模式", "讓兩個以上期間、群組、版本或情境在相同尺度下比較，強調差異與基準。", "A/B 測試、競品、區域績效、方案比較與前後分析。", "使用一致座標、明確基準、差值與百分比、可切換群組及統計說明；不要用雙軸誤導，也不要只以顏色區分系列。"],
        ["styles/34-predictive-analytics.html", "Predictive Analytics", "Data & System 模式", "同時呈現預測結果、不確定性、影響因素與模型限制，協助判斷而非假裝確定。", "需求預測、風險、庫存、維護、金融與成長規劃。", "呈現預測區間、可信度、歷史實際值、主要驅動因素和模型更新時間；提供情境調整與人工覆核，避免只給單一神奇數字。"],
        ["styles/35-user-behavior-analytics.html", "User Behavior Analytics", "Data & System 模式", "用漏斗、路徑、留存、分群與事件序列理解使用者如何完成或放棄任務。", "產品、成長、UX 研究、內容與電商團隊。", "建立事件定義、時間窗、漏斗、旅程、留存與 cohort 篩選；清楚標示樣本量與隱私界線，不把相關性當成因果。"],
        ["styles/36-financial-analytics.html", "Financial Dashboard", "Data & System 模式", "以精確數字、期間比較、現金流、預算差異與風險提示支援財務決策。", "財務團隊、管理會計、投資、預算與收入管理。", "使用 tabular numbers、幣別與期間單位、可稽核明細、variance 和 export；負值與警示不只靠紅色，所有計算需標示來源與更新時間。"],
        ["styles/37-sales-intelligence.html", "Sales Intelligence", "Data & System 模式", "把 pipeline、預測、商機健康度、活動與下一步整合成可執行的銷售工作面。", "業務主管、AE、RevOps 與客戶成功團隊。", "顯示 funnel、階段轉換、deal risk、預測區間、owner 與 next action；支援篩選、排序和明細，不只展示漂亮的總營收。"],
        ["styles/38-neubrutalism.html", "Neubrutalism", "視覺風格", "以粗黑框、硬偏移陰影、高飽和純色與大膽字體形成可愛又直接的數位粗獷感。", "Gen Z 品牌、創意工具、個人作品集與新創產品。", "使用 3–4px 黑框、4–8px 無模糊陰影、純色表面、粗體字與有限圓角；禁止漸層與柔光，按壓狀態像實體位移。"],
        ["styles/39-bento-box.html", "Bento Box Grid", "版面風格", "以大小不一但邊界一致的卡片組成便當盒式資訊總覽，讓多種內容保持模組化與可掃讀。", "產品功能、個人作品、品牌能力與輕量儀表板。", "使用 4–12 欄網格、跨欄卡片、固定 gap 和一致圓角；每格只有一個重點，手機版按優先順序改為單欄。"],
        ["styles/40-y2k-revival.html", "Y2K Revival", "視覺風格", "重現千禧年前後的科技樂觀：泡泡形狀、鉻銀、亮粉色、青色、光澤與早期數位介面。", "時尚、音樂、娛樂、青春品牌與懷舊活動。", "使用泡泡圓角、銀色／鉻感、粉紅與青色、高光按鈕和少量星芒；保留清楚文字層，避免每個元素都發光。"],
        ["styles/41-cyberpunk.html", "Cyberpunk", "視覺風格", "深色都市基底、霓虹訊號、科技標記、故障感與高密度資訊，帶有反體制與工業未來氣氛。", "遊戲、音樂、科幻敘事、資安與娛樂品牌。", "使用近黑背景、青／洋紅／酸黃重點、窄體或等寬字、切角框和受控 glitch；主要文字不使用霓虹光暈，狀態必須有文字標籤。"],
        ["styles/42-organic-biophilic.html", "Organic Biophilic", "視覺風格", "從自然色、植物形態、柔和曲線、紙質感與不規則留白建立平靜、親近生命的體驗。", "永續、健康、餐飲、旅宿、園藝與生活品牌。", "使用泥土／葉綠／砂岩色、有機曲線、自然攝影、柔和紙紋與寬鬆節奏；避免套用制式綠色漸層，內容和永續主張需具體。"],
        ["styles/43-ai-native.html", "AI-Native UI", "AI 產品模式", "介面圍繞意圖輸入、生成過程、工具調用、可追溯結果與人類覆核設計，而不是只加聊天框。", "Agent、copilot、生成工具、研究與自動化工作流。", "呈現 prompt／context、streaming 狀態、來源、工具步驟、可編輯產物、重試與人工確認；清楚區分 AI 建議和已執行動作。"],
        ["styles/44-memphis-revival.html", "Memphis Revival", "視覺風格", "用幾何碎片、波浪、點陣、原色與不對稱排列創造 80 年代後現代的活潑節奏。", "活動、教育、創意品牌、兒童與文化內容。", "使用 3–5 種明亮色、簡單幾何、點線圖案與不對稱構圖；裝飾放在內容外圍，卡片與文字區保持穩定。"],
        ["styles/45-vaporwave.html", "Vaporwave", "視覺風格", "粉紫青漸層、夕陽、網格、古典雕像與早期電腦符號形成夢境般的網路懷舊。", "音樂、藝術、時尚、活動與實驗作品集。", "使用粉紅／紫／青、網格地平線、低解析紋理、古典與數位拼貼；限制文字特效並確保 CTA 不被背景吞沒。"],
        ["styles/46-dimensional-layering.html", "Dimensional Layering", "視覺風格", "透過重疊、遮擋、陰影、大小與 z 軸順序建立空間層級，比單純卡片網格更有前後關係。", "儀表板、媒體、產品展示、導航與多工作面工具。", "定義 3–4 個 elevation 層級、合理遮擋和一致陰影；互動元素永遠在可點層，手機版減少重疊並維持閱讀順序。"],
        ["styles/47-exaggerated-minimalism.html", "Exaggerated Minimalism", "視覺風格", "保留極少元素，但把字級、留白、對比或單一圖形放大到具有宣言感。", "時尚、建築、作品集、藝廊與高端品牌。", "使用超大型標題、極寬留白、單一強色或圖形、非常少的 CTA；控制行長和換行，手機版縮放但保留戲劇性。"],
        ["styles/48-kinetic-typography.html", "Kinetic Typography", "動態視覺風格", "文字本身是主要視覺與動態角色，透過位移、縮放、遮罩和節奏表達語氣與內容變化。", "音樂、活動、片頭、品牌宣言與實驗作品集。", "先確保靜態文字完整可讀，再用 transform/opacity 和遮罩建立節奏；不移動長篇內文，提供 reduced-motion 的穩定排版。"],
        ["styles/49-parallax-storytelling.html", "Parallax Storytelling", "敘事版面", "不同速度的前景、內容與背景配合章節捲動，形成空間感和故事推進。", "品牌故事、產品發表、旅遊、文化與資料敘事。", "用 2–3 個景深層、清楚章節與 sticky 關鍵畫面；避免綁架捲動，手機與 reduced-motion 使用正常文件流替代。"],
        ["styles/50-swiss-modernism.html", "Swiss Modernism 2.0", "視覺風格", "在國際主義網格、無襯線排版與客觀資訊上加入更彈性的數位響應、變數字體與現代色彩。", "設計系統、編輯平台、科技品牌與專業作品集。", "使用可響應模組網格、精準基線、變數無襯線字、黑白主體與單一鮮色；允許局部打破網格，但資訊順序必須保持。"],
        ["styles/51-hud-scifi.html", "HUD/Sci-Fi Interface", "視覺風格", "以細線框、角標、掃描線、等寬字與即時數據模擬抬頭顯示器和科幻控制台。", "遊戲、軍事科幻、模擬器、監控與娛樂裝置。", "使用深藍黑背景、細青色線、角括號、等寬字和少量黃／紅警示；資訊分層清楚、光暈節制，重要操作具有文字和 44px 點擊區。"],
        ["styles/52-pixel-art.html", "Pixel Art / Retro Gaming", "視覺風格", "以低解析像素、有限色盤、方格邊框與早期遊戲字體重現 8/16-bit 介面。", "獨立遊戲、懷舊活動、遊戲化工具與像素藝術作品。", "採固定像素網格、image-rendering: pixelated、4px 方框、有限 4–16 色和像素字；禁止平滑陰影與任意圓角，長文字仍需可讀。"],
        ["styles/53-bento-grids.html", "Bento Grids", "版面風格", "以現代大圓角、不同尺寸卡片與明確跨欄關係展示功能、數據與媒體，強調快速掃讀。", "產品首頁、功能總覽、作品集與輕量儀表板。", "使用 4–12 欄非對稱網格、16px gap、24px 左右圓角和每卡單一訊息；以一張主卡建立焦點，手機依優先序單欄排列。"],
        ["styles/54-neubrutalism-v2.html", "Neubrutalism Component System", "元件視覺系統", "把 Neubrutalism 的粗框、硬陰影與飽和色落實到按鈕、表單、卡片、空狀態和對話框等完整元件狀態。", "需要建立可重複元件庫的創意工具、Gen Z 品牌與新創產品。", "建立一致的 4px 黑框、6px 硬陰影、純色 token、粗體字與按壓位移；完整輸出 default/hover/focus/disabled/error/empty/dialog 狀態。"],
        ["styles/55-spatial-ui.html", "Spatial UI", "視覺風格", "透過半透明玻璃、浮動視窗、環境光與深度層級模擬空間運算介面，焦點比平面位置更重要。", "AR/VR、Vision Pro 概念、沉浸媒體與未來工作空間。", "使用 15–30% 玻璃面板、40px 左右 blur、24px 圓角、多層 elevation 和清楚 focus；控制透明度與效能，手機改為線性視窗堆疊。"],
        ["styles/56-e-ink-paper.html", "E-Ink / Paper", "視覺風格", "以紙張底色、高對比墨色、閱讀字體、細線與幾乎零動態呈現安靜的數位出版感。", "閱讀器、新聞、筆記、文件、慢生活與專注工具。", "使用 off-white、ink black、serif 正文、mono 標籤、0px 圓角、無陰影無漸層和即時狀態切換；優先長文行長與列印友善。"],
        ["styles/57-gen-z-chaos.html", "Gen Z Chaos", "視覺風格", "刻意使用碰撞色、貼紙、傾斜卡片、網路語彙與拼貼感製造可控混亂和高情緒辨識度。", "音樂、街頭時尚、青年活動、病毒行銷與實驗作品集。", "使用亮粉／綠／黃／藍碰撞、貼紙層、局部旋轉、混合字體和玩味文案；核心操作保持穩定可讀，動畫支援 reduced-motion。"]
    ];

    const styleGuides = new Map(
        guideDefinitions.map(([href, name, kind, summary, bestFor, direction]) => [
            href,
            { href, name, kind, summary, bestFor, direction }
        ])
    );

    const promptFor = (guide) => `請為「[產品／頁面名稱]」產生一個完整、可執行的「${guide.name}」介面檔案。

產品與任務
- 使用者：[目標使用者]
- 核心任務：[使用者要完成什麼]
- 頁面類型：[Landing／Dashboard／Workspace／Settings／其他]
- 技術棧：[HTML + Tailwind CSS／React／Next.js／其他]

設計方向
${guide.direction}

內容與元件
- 使用符合產品情境的真實文案與資料，不要使用 Lorem ipsum。
- 建立清楚資訊層級，以及主要、次要、disabled／loading 按鈕。
- 至少包含一個有可見標籤的表單與可復原錯誤、空狀態，以及帶取消路徑的確認對話框。
- 使用一致的 SVG 圖示，不以 emoji 代替功能圖示。

品質要求
- 完整支援 320px–1440px RWD，不得水平溢出。
- 所有點擊目標至少 44×44px，可使用鍵盤操作並具有清楚 focus 狀態。
- 文字與控制元件達到 WCAG AA；顏色不能是唯一狀態提示。
- 動態只用於表達因果，並支援 prefers-reduced-motion。

這個風格是參考方向，不是限制其他設計可能；若風格與任務衝突，以可用性、內容與工作流程為優先。請直接輸出完整檔案與必要的執行說明。`;

    const dialog = document.querySelector("#style-guide-dialog");
    const dialogTitle = dialog?.querySelector("[data-guide-title]");
    const dialogKind = dialog?.querySelector("[data-guide-kind]");
    const descriptionPanel = dialog?.querySelector("[data-description-panel]");
    const promptPanel = dialog?.querySelector("[data-prompt-panel]");
    const summary = dialog?.querySelector("[data-guide-summary]");
    const bestFor = dialog?.querySelector("[data-guide-best-for]");
    const direction = dialog?.querySelector("[data-guide-direction]");
    const promptOutput = dialog?.querySelector("[data-prompt-output]");
    const copyButton = dialog?.querySelector("[data-copy-prompt]");
    const copyStatus = dialog?.querySelector("[data-copy-status]");

    if (!dialog || !dialogTitle || !dialogKind || !descriptionPanel || !promptPanel || !promptOutput) {
        console.error("Style guide dialog is incomplete.");
        return;
    }

    const icon = (type) => type === "description"
        ? '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 4.75A2.75 2.75 0 0 1 7.75 2H19v17H7.75A2.75 2.75 0 0 0 5 21.75v-17Z"/><path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H19M9 7h6M9 11h5"/></svg>'
        : '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14"/></svg>';

    const openGuide = (guide, mode) => {
        const isPrompt = mode === "prompt";
        dialogTitle.textContent = `${guide.name}｜${isPrompt ? "AI Prompt" : "風格說明"}`;
        dialogKind.textContent = guide.kind;
        descriptionPanel.hidden = isPrompt;
        promptPanel.hidden = !isPrompt;

        if (isPrompt) {
            promptOutput.value = promptFor(guide);
            if (copyStatus) copyStatus.textContent = "";
            if (copyButton) copyButton.textContent = "複製 Prompt";
        } else {
            summary.textContent = guide.summary;
            bestFor.textContent = guide.bestFor;
            direction.textContent = guide.direction;
        }

        dialog.showModal();
    };

    const cardLinks = [...document.querySelectorAll('a.card-hover[href^="styles/"]')];

    cardLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const guide = styleGuides.get(href);
        if (!guide) return;

        const card = document.createElement("article");
        card.className = `${link.className} style-card`;
        card.dataset.styleHref = href;
        link.before(card);

        link.className = "style-card-link";
        link.setAttribute("aria-label", `開啟 ${guide.name} 範例頁`);
        card.append(link);

        const actions = document.createElement("div");
        actions.className = "style-card-actions";

        [
            ["description", "風格說明"],
            ["prompt", "AI Prompt"]
        ].forEach(([mode, label]) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `style-card-action style-card-action--${mode}`;
            button.innerHTML = `${icon(mode)}<span>${label}</span>`;
            button.setAttribute("aria-label", `${guide.name}：${label}`);
            button.addEventListener("click", () => openGuide(guide, mode));
            actions.append(button);
        });

        card.append(actions);
    });

    if (cardLinks.length !== styleGuides.size) {
        console.warn(`Style guide count mismatch: ${cardLinks.length} cards, ${styleGuides.size} guides.`);
    }

    dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
        button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });

    const fallbackCopy = (text) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.append(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        return copied;
    };

    copyButton?.addEventListener("click", async () => {
        const text = promptOutput.value;
        let copied = false;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                copied = true;
            } else {
                copied = fallbackCopy(text);
            }
        } catch {
            copied = fallbackCopy(text);
        }

        copyButton.textContent = copied ? "已複製" : "請手動複製";
        if (copyStatus) copyStatus.textContent = copied ? "Prompt 已複製到剪貼簿。" : "無法存取剪貼簿，請選取文字手動複製。";
    });
})();
