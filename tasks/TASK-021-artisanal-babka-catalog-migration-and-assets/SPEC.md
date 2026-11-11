# Architectural Specification: TASK-021 — Artisanal Babka Catalog Migration & Assets

> **Task ID:** `TASK-021-artisanal-babka-catalog-migration-and-assets`  
> **Milestone:** Milestone 17 — Artisanal Babka Full Catalog Migration & Visual Assets Generation  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Assignee:** Agent Beta (Senior Full-Stack Implementer)  
> **Visual Reference:** Hashousha Official Menu Card (`.user_uploaded/media_1791585993375.jpg`)  
> **Status:** 🟡 `Phase A Approved (Ready for Implementation)`  
> **Created:** 2026-10-10T01:55:00+03:00  

---

## 1. Strategic Context & The Historical Pivot

In accordance with executive directives from the Founder and the Brand Chief of Staff, **Hashousha (هشوشة)** executes a definitive brand transformation:
- **Complete Legacy Purge:** All historic vine leaves (`warak-enab`), stuffed cabbage (`malfouf`), and legacy sweets are purged from the platform.
- **Flagship Identity:** Hashousha is now established as the premier **Online Luxury Artisanal Babka & Bakery Boutique** in Riyadh (`Sweet & Savory Bakes`).
- **Official Ground Truth:** The official printed menu card (`media_1791585993375.jpg`) forms the exact specifications for all 19 items across pricing, portion sizing, naming, and flavor profiles.

---

## 2. Pillar 1: Legacy Catalog Purge & The 4 New Categories

### 2.1 Database & Codebase Purge
1. **Frontend Catalog (`src/data/menu.ts`):** Completely wipe the legacy array of dishes and categories.
2. **Cloud Database Table (`public.dishes`):** Execute a SQL migration to delete legacy items and reset with the 19 Babka records.
3. **Cloud Database Table (`public.categories`):** Reset categories table with the 4 new Babka categories.

### 2.2 The 4 Approved Babka Categories
```typescript
export type CategoryId = "all" | "mini-babka" | "medium-babka" | "family-babka" | "babka-boxes"

export const categories: Category[] = [
  { id: "all", label: "جميع المخبوزات" },
  { id: "mini-babka", label: "البابكا ميني" },
  { id: "medium-babka", label: "البابكا حجم وسط" },
  { id: "family-babka", label: "البابكا حجم عائلي" },
  { id: "babka-boxes", label: "بوكسات البابكا" },
]
```

---

## 3. Pillar 2: Full Data Engineering for All 19 Artisanal Babka Items

```
+---------------------------------------------------------------------------------------------------------+
|                                  THE 19 ARTISANAL BABKA CATALOG MATRIX                                  |
+----+--------------------------------------------+---------------+-------+----------------+--------------+
| #  | Name (Arabic)                              | Category      | Price | Unit           | Flavor Class |
+----+--------------------------------------------+---------------+-------+----------------+--------------+
| 1  | بابكا ميني بيستو                           | mini-babka    | 12 ر.س| قطعة           | مالح (Savory)|
| 2  | بابكا ميني اجبان                           | mini-babka    | 10 ر.س| قطعة           | مالح (Savory)|
| 3  | بابكا ميني بيتزا                           | mini-babka    | 10 ر.س| قطعة           | مالح (Savory)|
| 4  | بابكا ميني زعتر ولبنة                      | mini-babka    | 10 ر.س| قطعة           | مالح (Savory)|
| 5  | بابكا ميني نوتيلا وبيكان                   | mini-babka    | 12 ر.س| قطعة           | حلو (Sweet)  |
| 6  | بابكا ميني كاسترد وشوكولاتة                | mini-babka    | 10 ر.س| قطعة           | حلو (Sweet)  |
| 7  | بابكا ميني سينابون                         | mini-babka    | 10 ر.س| قطعة           | حلو (Sweet)  |
| 8  | بابكا حجم عائلي زعتر بيتزا او اجبان        | family-babka  | 75 ر.س| قالب عائلي     | مالح (Savory)|
| 9  | بابكا حجم عائلي بيستو                      | family-babka  | 85 ر.س| قالب عائلي     | مالح (Savory)|
| 10 | بابكا حجم عائلي نوتيلا وبيكان              | family-babka  | 85 ر.س| قالب عائلي     | حلو (Sweet)  |
| 11 | بابكا حجم عائلي سينابون او كاسترد          | family-babka  | 75 ر.س| قالب عائلي     | حلو (Sweet)  |
| 12 | بابكا حجم وسط بيستو                        | medium-babka  | 50 ر.س| قالب وسط       | مالح (Savory)|
| 13 | بابكا حجم وسط زعتر بيتزا او اجبان          | medium-babka  | 40 ر.س| قالب وسط       | مالح (Savory)|
| 14 | بابكا حجم وسط نوتيلا وبيكان                | medium-babka  | 50 ر.س| قالب وسط       | حلو (Sweet)  |
| 15 | بابكا حجم وسط سينابون او كاسترد            | medium-babka  | 40 ر.س| قالب وسط       | حلو (Sweet)  |
| 16 | بوكس بابكا حجم عائلي بيستو (24 قطعة)       | babka-boxes   | 90 ر.س| بوكس ٢٤ قطعة   | مالح (Savory)|
| 17 | بوكس بابكا حجم عائلي زعتر بيتزا او اجبان   | babka-boxes   | 80 ر.س| بوكس ٢٤ قطعة   | مالح (Savory)|
| 18 | بوكس بابكا حجم عائلي نوتيلا وبيكان (24 قطعة)| babka-boxes   | 90 ر.س| بوكس ٢٤ قطعة   | حلو (Sweet)  |
| 19 | بوكس بابكا حجم عائلي سينابون او كاسترد     | babka-boxes   | 80 ر.س| بوكس ٢٤ قطعة   | حلو (Sweet)  |
+----+--------------------------------------------+---------------+-------+----------------+--------------+
```

### Detailed Item Specifications

#### Category: `mini-babka` (البابكا ميني)

1. **`babka-mini-pesto` — بابكا ميني بيستو**
   - **English Name:** Mini Pesto Babka
   - **Category:** `mini-babka`
   - **Price:** `12` | **Unit:** `قطعة` | **Serving:** `تكفي شخص واحد`
   - **Short Description:** بريوش فرنسي مجدول ومخمر ببطء، محشو ببيستو الريحان الإيطالي الفاخر والصنوبر المحمص مع لمسة زيت زيتون بكر وجبنة بارميزان معتقة.
   - **Long Description:** تحفة إيطالية كلاسيكية بلمسة هشوشة الحرفية؛ تُعجن بطحين فاخر وزبدة طبيعية نقية، ثم تُجدل بطبقات سخية من بيستو الريحان العطري الطازج الممزوج بالصنوبر الذهبي وجبنة البارميزان المعتقة، لتمنحكم نكهة عشبية دافئة وقواماً قطنياً يذوب في الفم.
   - **Serving Tip:** تُسخّن لمدة دقيقتين في الفرن بدرجة حرارة ١٦٠ مئوية لتفوح روائح الريحان والصنوبر الزكية.
   - **Badges:** `["signature", "savory"]`

2. **`babka-mini-cheese` — بابكا ميني اجبان**
   - **English Name:** Mini Cheese Babka
   - **Category:** `mini-babka`
   - **Price:** `10` | **Unit:** `قطعة` | **Serving:** `تكفي شخص واحد`
   - **Short Description:** بريوش الزبدة الطبيعية الغني بمزيج أجبان عكاوي وموزاريلا وقشقوان، تعلوه رشة حبة البركة والسمسم المحمص.
   - **Long Description:** الدفء الصباحي في أبهى صوره؛ جدائل بريوش ذهبية هشة تحتضن توليفة متناغمة من ثلاثة أجبان فاخرة تذوب مع حرارة الخبز، وتتوج بحبة البركة والسمسم المحمص لتكون رفيقة مثالية لمائدة الإفطار والجمعات.
   - **Serving Tip:** تُقدم دافئة مباشرة ليذوب مزيج الأجبان مع كل لقمة طرية.
   - **Badges:** `["popular", "savory"]`

3. **`babka-mini-pizza` — بابكا ميني بيتزا**
   - **English Name:** Mini Pizza Babka
   - **Category:** `mini-babka`
   - **Price:** `10` | **Unit:** `قطعة` | **Serving:** `تكفي شخص واحد`
   - **Short Description:** نكهة البيتزا الإيطالية الأصيلة في قالب بابكا؛ صلصة طماطم متبلة، موزاريلا ذائبة، زيتون أسود، وأوريغانو بري.
   - **Long Description:** ابتكار عصري يجمع بين ليونة البريوش الحرفي ونكهة البيتزا النابولية المحبوبة؛ صلصة طماطم مطهوة ببطء مع الأعشاب الإيطالية وجبنة موزاريلا تسيل برقة بين الجدائل المحمرة بإتقان.
   - **Serving Tip:** تسخين خفيف في القلاية الهوائية يمنح القشرة الخارجية قرمشة خفيفة وقلباً ذائباً.
   - **Badges:** `["savory", "new"]`

4. **`babka-mini-zaatar-labneh` — بابكا ميني زعتر ولبنة**
   - **English Name:** Mini Zaatar & Labneh Babka
   - **Category:** `mini-babka`
   - **Price:** `10` | **Unit:** `قطعة` | **Serving:** `تكفي شخص واحد`
   - **Short Description:** توازن تقليدي بديع بين حموضة اللبنة التركية الكريمية ونكهة الزعتر البلدي وزيت الزيتون الفلسطيني.
   - **Long Description:** ثنائية الضيافة الشرقية الخالدة مجدولة في عجين مخمر طبيعياً؛ مزيج من الزعتر البري مع اللبنة الكريمية وزيت الزيتون المعصور على البارد، يمنح توازناً يبهج الحواس من اللقمة الأولى.
   - **Serving Tip:** مثالية مع الشاي الساخن بالنعناع في المجالس الصباحية.
   - **Badges:** `["savory"]`

5. **`babka-mini-nutella-pecan` — بابكا ميني نوتيلا وبيكان**
   - **English Name:** Mini Nutella & Pecan Babka
   - **Category:** `mini-babka`
   - **Price:** `12` | **Unit:** `قطعة` | **Serving:** `تكفي شخص واحد`
   - **Short Description:** الصنف الأيقوني الأكثر طلباً؛ شوكولاتة نوتيلا كثيفة مع جوز بيكان أمريكي محمص تتخلل جدائل البريوش المكرمل.
   - **Long Description:** أسطورة مخبوزات هشوشة؛ عجينة بريوش كلاسيكية غنية بالزبدة تُلف بطبقات وفيرة من شوكولاتة النوتيلا الفاخرة وتُرص بقطع جوز البيكان الأمريكي المحمص، لتكتسب قشرة خارجية مكرملة وقلباً دافئاً فائق الطراوة.
   - **Serving Tip:** تُدفأ قليلاً لمدة ٢٠ ثانية لتنساب الشوكولاتة الذائبة مع قرمشة حبات البيكان.
   - **Badges:** `["popular", "signature", "sweet"]`

6. **`babka-mini-custard-chocolate` — بابكا ميني كاسترد وشوكولاتة**
   - **English Name:** Mini Custard & Chocolate Babka
   - **Category:** `mini-babka`
   - **Price:** `10` | **Unit:** `قطعة` | **Serving:** `تكفي شخص واحد`
   - **Short Description:** كاسترد فرنسي مخملي بنكهة الفانيليا الطبيعية مع رقائق الشوكولاتة البلجيكية الفاخرة داخل عجين بريوش قطني.
   - **Long Description:** تناغم فرنسي أرستقراطي يجمع بين نعومة الكاسترد الغني بالفانيليا الطبيعية ومرارة الشوكولاتة البلجيكية المتوازنة، ملفوفة في عجين مروي بأجود أنواع الزبدة الطبيعية.
   - **Serving Tip:** تُقدم بدرجة حرارة الغرفة مع قهوة V60 أو إسبريسو غني.
   - **Badges:** `["sweet"]`

7. **`babka-mini-cinnabon` — بابكا ميني سينابون**
   - **English Name:** Mini Cinnabon Babka
   - **Category:** `mini-babka`
   - **Price:** `10` | **Unit:** `قطعة` | **Serving:** `تكفي شخص واحد`
   - **Short Description:** قرفة سيلانية فاخرة مكرملة بالسكر البني بين طبقات البابكا، متوجة بجليز جبن كريمي أبيض فاخر.
   - **Long Description:** دفء القرفة السيلانية العطرة يمتزج بالسكر البني المكرمل بين جدائل البابكا الطرية، متوجة بخطوط أنيقة من الفروستينج الكريمي المخملي ليقدم مذاق السينابون الكلاسيكي بأناقة البابكا الحرفية.
   - **Serving Tip:** تُقدم دافئة لتستمتعوا بتصاعد عبير القرفة والكراميل الأخّاذ.
   - **Badges:** `["sweet", "popular"]`

---

#### Category: `family-babka` (البابكا حجم عائلي)

8. **`babka-family-zaatar-pizza-cheese` — بابكا حجم عائلي زعتر بيتزا او اجبان**
   - **English Name:** Family Zaatar Pizza or Cheese Babka
   - **Category:** `family-babka`
   - **Price:** `75` | **Unit:** `قالب عائلي كبير` | **Serving:** `تكفي ٦-٨ أشخاص`
   - **Short Description:** قالب ضيافة عائلي كبير يجمع نكهات الأجبان المعتقة والزعتر البلدي أو البيتزا الإيطالية بجدائل محمرة فاخرة.
   - **Long Description:** صينية ضيافة ملكية تليق بأفخم الجمعات والمناسبات العائلية في مجالس الرياض؛ بحجم سخي يجمع بين دسامة الأجبان المحمرة ونكهات الزعتر والبيتزا في جدائل متشابكة هشة، خُبزت بحرفية لتبهر ضيوفكم.
   - **Serving Tip:** تُقطع إلى شرائح سميكة وتُقدم دافئة في وسط مائدة الضيافة مع الشاي الساخن.
   - **Badges:** `["savory", "signature"]`

9. **`babka-family-pesto` — بابكا حجم عائلي بيستو**
   - **English Name:** Family Pesto Babka
   - **Category:** `family-babka`
   - **Price:** `85` | **Unit:** `قالب عائلي كبير` | **Serving:** `تكفي ٦-٨ أشخاص`
   - **Short Description:** قالب عائلي مهيب غني ببيستو الريحان الإيطالي الفاخر وحبوب الصنوبر المحمصة وجبنة البارميزان.
   - **Long Description:** قطعة فنية فاخرة تزين مائدة الجمعات الكبرى؛ مشبعة بعبير البيستو الأخضر النضر وحبات الصنوبر المحمصة، تمنح المجالس رونقاً إيطالياً فندقياً فخماً لا يُنسى.
   - **Serving Tip:** تُسخّن بالفرن قبل التقديم وتُقدم مع زيت زيتون بكر وأطباق الأجبان المشكلة.
   - **Badges:** `["savory", "popular"]`

10. **`babka-family-nutella-pecan` — بابكا حجم عائلي نوتيلا وبيكان**
    - **English Name:** Family Nutella & Pecan Babka
    - **Category:** `family-babka`
    - **Price:** `85` | **Unit:** `قالب عائلي كبير` | **Serving:** `تكفي ٦-٨ أشخاص`
    - **Short Description:** القالب البطل لمجالس الرياض؛ شوكولاتة نوتيلا كثيفة تتدفق بين الجدائل مع تغطية فاخرة بأنصاف جوز البيكان الأمريكي.
    - **Long Description:** الصنف الأبرز لمجالس الضيافة الراقية؛ قالب عائلي مهيب يتدفق منه صوص النوتيلا الكثيف بين طيات البريوش المغطى بالكامل بأنصاف جوز البيكان الذهبي المحمص، عنوان الفخامة والكرم في كل جمعة.
    - **Serving Tip:** مثالية للمناسبات الكبرى وتُقدم دافئة مع القهوة السعودية الأصيلة.
    - **Badges:** `["popular", "signature", "sweet"]`

11. **`babka-family-cinnabon-custard` — بابكا حجم عائلي سينابون او كاسترد**
    - **English Name:** Family Cinnabon or Custard Babka
    - **Category:** `family-babka`
    - **Price:** `75` | **Unit:** `قالب عائلي كبير` | **Serving:** `تكفي ٦-٨ أشخاص`
    - **Short Description:** قالب عائلي استثنائي بنكهات القرفة السيلانية المكرملة أو الكاسترد الفرنسي مع الجليز الكريمي المخملي.
    - **Long Description:** صينية عائلية آسرة تجمع بين نكهات السينابون الكلاسيكية الدافئة وحشوة الكاسترد الفرنسي الغنية، تملأ المنزل برائحة المخبز الحرفي الباعثة على السعادة وتبهج أفراد العائلة في كل اجتماع.
    - **Serving Tip:** يُعاد تدفئتها في الفرن ٥ دقائق قبل التقديم لإبراز قوام العجين المجدول الطري.
    - **Badges:** `["sweet"]`

---

#### Category: `medium-babka` (البابكا حجم وسط)

12. **`babka-medium-pesto` — بابكا حجم وسط بيستو**
    - **English Name:** Medium Pesto Babka
    - **Category:** `medium-babka`
    - **Price:** `50` | **Unit:** `قالب وسط` | **Serving:** `تكفي ٣-٤ أشخاص`
    - **Short Description:** قالب وسط أنيق محشو ببيستو الريحان والصنوبر المحمص والبارميزان؛ مثالي للقاءات العصرية.
    - **Long Description:** الحجم المثالي للقاءات الأصدقاء والزيارات المسائية الخفيفة؛ بطيات بيستو نضرة وصنوبر مقرمش محاك بعناية فائقة لتقديم تجربة تذوق متكاملة.
    - **Serving Tip:** تُقدم دافئة مع غموس اللبنة وزيت الزيتون.
    - **Badges:** `["savory"]`

13. **`babka-medium-zaatar-pizza-cheese` — بابكا حجم وسط زعتر بيتزا او اجبان**
    - **English Name:** Medium Zaatar Pizza or Cheese Babka
    - **Category:** `medium-babka`
    - **Price:** `40` | **Unit:** `قالب وسط` | **Serving:** `تكفي ٣-٤ أشخاص`
    - **Short Description:** قالب وسط مشبع بالأجبان الذائبة والزعتر العطري وصلصة البيتزا؛ ضيافة شاي راقية ومغذية.
    - **Long Description:** قالب وسط غني ومحمر بإتقان، يمزج نكهات الجبن الذائب والزعتر العطري مع عجين البريوش المخمر ببطء ليوفر وجبة ضيافة خفيفة وممتعة.
    - **Serving Tip:** تُقطع شرائح وتُقدم كضيافة شاي مسائية متميزة.
    - **Badges:** `["savory"]`

14. **`babka-medium-nutella-pecan` — بابكا حجم وسط نوتيلا وبيكان**
    - **English Name:** Medium Nutella & Pecan Babka
    - **Category:** `medium-babka`
    - **Price:** `50` | **Unit:** `قالب وسط` | **Serving:** `تكفي ٣-٤ أشخاص`
    - **Short Description:** قالب وسط غني بشوكولاتة النوتيلا الذائبة وحبات البيكان المحمص؛ رفيق مثالي لجلسات القهوة المسائية.
    - **Long Description:** الحجم المفضل لجلسات القهوة المختصة، تفيض بشوكولاتة النوتيلا المقترنة بقرمشة حبات البيكان الطازجة، لترضي رغبة التحلية الفاخرة بحجم ملائم.
    - **Serving Tip:** تسخين بسيط ٣٠ ثانية في المايكروويف أو دقيقتين بالفرن.
    - **Badges:** `["popular", "sweet"]`

15. **`babka-medium-cinnabon-custard` — بابكا حجم وسط سينابون او كاسترد**
    - **English Name:** Medium Cinnabon or Custard Babka
    - **Category:** `medium-babka`
    - **Price:** `40` | **Unit:** `قالب وسط` | **Serving:** `تكفي ٣-٤ أشخاص`
    - **Short Description:** قالب وسط بنكهة القرفة والكراميل أو الكاسترد الفرنسي الناعم؛ متعة دافئة مع مشروباتكم المفضلة.
    - **Long Description:** تجربة مخبوزات دافئة بحجم وسط ملائم، متوازنة الحلاوة والنكهات بعبير القرفة ولمسات الكاسترد المخملي، تُخبز يومياً بعناية فائقة.
    - **Serving Tip:** رشة خفيفة من السكر البودرة قبل التقديم تضفي لمسة فندقية أنيقة.
    - **Badges:** `["sweet"]`

---

#### Category: `babka-boxes` (بوكسات البابكا - 24 قطعة)

16. **`babka-box-pesto-24` — بوكس بابكا حجم عائلي بيستو (24 قطعة)**
    - **English Name:** Babka Box Family Size Pesto (24 Pcs)
    - **Category:** `babka-boxes`
    - **Price:** `90` | **Unit:** `بوكس ٢٤ قطعة` | **Serving:** `تكفي ٨-١٢ شخصاً`
    - **Short Description:** بوكس ضيافة فاخر يحتوي على ٢٤ قطعة ميني بابكا بيستو بالصنوبر؛ خيار مثالي لاجتماعات العمل وبوفيهات المناسبات.
    - **Long Description:** البوكس الأكثر تميزاً لجمعات الدوام والمناسبات الراقية بالرياض؛ ٢٤ قطعة ميني بابكا بيستو مرتبة بعناية فائقة في بوكس إهداء فاخر محكم الحفظ، تتيح للضيوف متعة التناول الفردي الأنيق.
    - **Serving Tip:** جاهز للتقديم المباشر في البوكس الفندقي الفاخر دون الحاجة لنقل أو ترتيب.
    - **Badges:** `["signature", "savory"]`

17. **`babka-box-zaatar-pizza-cheese-24` — بوكس بابكا حجم عائلي زعتر بيتزا او اجبان (24 قطعة)**
    - **English Name:** Babka Box Family Zaatar Pizza or Cheese (24 Pcs)
    - **Category:** `babka-boxes`
    - **Price:** `80` | **Unit:** `بوكس ٢٤ قطعة` | **Serving:** `تكفي ٨-١٢ شخصاً`
    - **Short Description:** بوكس مشكل فاخر يضم ٢٤ قطعة ميني بابكا مالحة (أجبان، زعتر، بيتزا) لضيافة ترضي جميع الأذواق.
    - **Long Description:** تشكيلة موائد متكاملة من ٢٤ قطعة ميني بابكا مالحة، ترضي جميع الأذواق بمزيج الأجبان والبيتزا والزعتر البلدي الفاخر، صُممت لتكون نجمة بوفيهات الفطور والعشاء في الرياض.
    - **Serving Tip:** يُفتح البوكس ويوضع مباشرة على بوفيه الإفطار أو العشاء الخفيف.
    - **Badges:** `["popular", "savory"]`

18. **`babka-box-nutella-pecan-24` — بوكس بابكا حجم عائلي نوتيلا وبيكان (24 قطعة)**
    - **English Name:** Babka Box Family Nutella & Pecan (24 Pcs)
    - **Category:** `babka-boxes`
    - **Price:** `90` | **Unit:** `بوكس ٢٤ قطعة` | **Serving:** `تكفي ٨-١٢ شخصاً`
    - **Short Description:** بوكس الإهداء الأكثر فخامة؛ ٢٤ قطعة ميني بابكا نوتيلا وبيكان محمص في علبة مذهبة تليق بأرقى المناسبات.
    - **Long Description:** خيار الضيافة الأول والهدية الأكثر فخامة في الرياض؛ بوكس مذهب يحتوي على ٢٤ قطعة ميني بابكا نوتيلا وبيكان تفوح برائحة الشوكولاتة والمخبوزات الطازجة، يُقدّم كرمز للحفاوة والذوق الرفيع.
    - **Serving Tip:** بوكس الإهداء المثالي لزيارات الأهل ومجالس الأعياد وحفلات النجاح مع القهوة العربية.
    - **Badges:** `["popular", "signature", "sweet"]`

19. **`babka-box-cinnabon-custard-24` — بوكس بابكا حجم عائلي سينابون او كاسترد (24 قطعة)**
    - **English Name:** Babka Box Family Cinnabon or Custard (24 Pcs)
    - **Category:** `babka-boxes`
    - **Price:** `80` | **Unit:** `بوكس ٢٤ قطعة` | **Serving:** `تكفي ٨-١٢ شخصاً`
    - **Short Description:** تشكيلة حلى استثنائية من ٢٤ قطعة ميني بابكا سينابون بالقرفة وكاسترد الفانيليا؛ حلاوة تكتمل بها بهجة الجمعات.
    - **Long Description:** تشكيلة حلى استثنائية من ٢٤ قطعة ميني بابكا غنية بنكهات السينابون والقرفة والكاسترد الناعم، مصممة للمجالس العامرة بالبهجة ولمحبي التحلية المتنوعة الفاخرة.
    - **Serving Tip:** مثالي مع دلة القهوة السعودية في الجمعات العائلية الكبرى.
    - **Badges:** `["sweet"]`

---

## 4. Pillar 3: Enterprise SEO Strategy & Metadata Contracts

Every dish record features:
1. **Canonical English Slug:** URL-safe, descriptive, keywords-focused.
2. **Hotel Meta Title:** e.g. `بابكا ميني نوتيلا وبيكان طازجة بالرياض | هشوشة للمخبوزات الفاخرة`
3. **CTR-Optimized Meta Description:** Action-oriented Arabic description enticing clicks from Google searches in Riyadh.

### Global Storefront SEO Updates (`src/services/adminService.ts`):
```typescript
export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteTitle: 'هشوشة (Hashousha) — متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض',
  siteDescription: 'أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر. تُخبز يومياً بعجين بريوش مخمر وتوصيل مجهز لكافة أحياء الرياض.',
  keywords: 'بابكا بالرياض, بابكا ميني, بابكا نوتيلا وبيكان, بوكسات بابكا, بابكا بيستو, مخبوزات فاخرة بالرياض, كوكيز هشوشة, هشوشة',
  ogImage: '/images/hero.png',
}
```

---

## 5. Pillar 4: Luxury Badges Realignment

Badges mapped in `src/types/menu.ts` and `src/services/badgeService.ts`:
- **`popular`:** الأكثر طلباً ٤٫٩ (ذهب محمص)
- **`signature`:** توقيع هشوشة ✨ (برونز مذهب)
- **`savory`:** مالح فاخر 🧀 (أوليف أخضر دافئ)
- **`sweet`:** حلو ملكي 🍫 (كاكاو وشوكولاتة)
- **`new`:** جديد المخبز 🌿 (أخضر ربيعي)

---

## 6. Pillar 5: AI Photoshoot & Asset Specification

### 6.1 Consistent Visual Identity Pattern (Prompt Architecture)
All 19 photography assets follow the exact luxury ambiance established by the official menu card:
- **Style:** Hotel-grade artisanal bakery studio photography, shallow depth of field (`f/2.8`), 85mm lens.
- **Lighting:** Warm golden morning side-lighting creating soft shadows and highlighting glossy glazes and chocolate drizzle.
- **Surface & Props:** Rustic warm linen canvas background, aged dark French oak baker's board, scattered roasted pecans, raw cinnamon sticks, or fresh basil leaves and pine nuts depending on flavor.
- **Pastry Texture:** Intricate braided brioche dough weave visible, deep golden crust, bubbling browned cheese or glossy chocolate ribbon.

### 6.2 Target Asset Paths
All assets are saved to `public/images/dishes/`:
1. `public/images/dishes/babka-mini-pesto.png`
2. `public/images/dishes/babka-mini-cheese.png`
3. `public/images/dishes/babka-mini-pizza.png`
4. `public/images/dishes/babka-mini-zaatar-labneh.png`
5. `public/images/dishes/babka-mini-nutella-pecan.png`
6. `public/images/dishes/babka-mini-custard-chocolate.png`
7. `public/images/dishes/babka-mini-cinnabon.png`
8. `public/images/dishes/babka-family-zaatar-pizza-cheese.png`
9. `public/images/dishes/babka-family-pesto.png`
10. `public/images/dishes/babka-family-nutella-pecan.png`
11. `public/images/dishes/babka-family-cinnabon-custard.png`
12. `public/images/dishes/babka-medium-pesto.png`
13. `public/images/dishes/babka-medium-zaatar-pizza-cheese.png`
14. `public/images/dishes/babka-medium-nutella-pecan.png`
15. `public/images/dishes/babka-medium-cinnabon-custard.png`
16. `public/images/dishes/babka-box-pesto-24.png`
17. `public/images/dishes/babka-box-zaatar-pizza-cheese-24.png`
18. `public/images/dishes/babka-box-nutella-pecan-24.png`
19. `public/images/dishes/babka-box-cinnabon-custard-24.png`

---

## 7. Pillar 6: Official WhatsApp & Brand Slogans Update

### 7.1 Official Channel Update
- **New Official WhatsApp:** `0598956580` (International: `966598956580`).
- **Files to update:**
  * `src/data/menu.ts` -> `WHATSAPP_NUMBER = "966598956580"`
  * `src/types/admin.ts` -> `whatsappNumber: '966598956580'`
  * `src/components/storefront/v0/FloatingWhatsApp.tsx` -> default to `966598956580`
  * `PROJECT_STATE.json` -> `primary_whatsapp_channel: "966598956580"`

### 7.2 Official Brand Slogans
- Arabic Tagline Top: **"مذاق يبهرك في كل لقمة"**
- Arabic Tagline Bottom: **"كل لقمة .. حكاية"**
- English Brand Tag: **"H A S H O U S H A — SWEET & SAVORY BAKES"**

---

## 8. Quality Gates & Acceptance Criteria

- [ ] All 19 dishes accurately registered in `src/data/menu.ts` matching official prices, units, and categories.
- [ ] 4 categories created (`mini-babka`, `medium-babka`, `family-babka`, `babka-boxes`) replacing legacy categories.
- [ ] SQL migration script ready and executed to sync cloud Supabase tables (`public.dishes`, `public.categories`).
- [ ] Every dish features rich ingredients, long description story, serving tip, and SEO metadata.
- [ ] All 19 visual photography assets generated and saved to `public/images/dishes/`.
- [ ] Official WhatsApp updated to `0598956580` across code and state files.
- [ ] `npm run build` (`tsc && vite build`) passes with 0 errors and 0 warnings.
