# TASK-025 Specification: Multi-Size Dish Variants, Hospitality Capacity & Category Realignment

> **Document Type:** Architecture & Technical Specification (Phase A)  
> **Authority:** Agent Alpha (Lead Software Architect & Creative Director)  
> **Implementer:** Agent Beta (Senior Implementer)  
> **Date:** 2026-10-13  
> **Status:** Approved for Implementation (Poster-Calibrated Catalog)  

---

## 1. Context & Master Poster Calibration

The Founder provided the official master menu poster (`media_1791918219652.jpg`) defining the exact real-world offerings, sizes, and pricing for **Hashousha (هشوشة)**:
1. **Unified Multi-Size Dishes**:
   - The same babka recipe (e.g. Nutella & Pecan, Pesto, Cinnabon, Custard, Triple Cheese, Pizza, Zaatar & Labneh) is presented as a **single unified product** with selectable size variants matching the poster.
   - Distinct sizes are explicitly calibrated to the poster:
     - **Mini (ميني فردي)**: 10 SAR or 12 SAR
     - **Medium (حجم وسط)**: 40 SAR or 50 SAR (Serving 4-6 guests)
     - **Family (حجم عائلي)**: 75 SAR or 85 SAR (Serving 8-10 guests)
2. **Dedicated Hospitality Boxes (`babka-boxes`)**:
   - The 4 master boxes (24 mini pieces each) are standalone products with individual pricing (80 SAR / 90 SAR) and hospitality capacity (10-14 guests).
3. **The 6 Sovereign Categories**:
   - `plain-dough-babka`: **البابكا بعجين ساده**
   - `cocoa-dough-babka`: **البابكا بعجين كاكاو**
   - `sweet-babka`: **البابكا الحلوه**
   - `savory-babka`: **البابكا المالحة**
   - `babka-boxes`: **بوكسات البابكا**
   - `cookies`: **الكوكيز**

---

## 2. Complete Catalog & Variant Matrix

### 2.1 Unified Multi-Size Dishes

#### 1. بابكا نوتيلا وبيكان (Nutella & Pecan Babka)
- **ID:** `babka-nutella-pecan`
- **Category:** `sweet-babka` (also matches `plain-dough-babka`)
- **Image:** `/images/dishes/babka-mini-nutella-pecan.png`
- **Variants:**
  - `mini`: ميني (فردي) | **12 ر.س** | تكفي شخص واحد (حبة ميني فاخرة)
  - `medium`: حجم وسط | **50 ر.س** | تكفي 4 إلى 6 أشخاص (صينية وسط 20 سم)
  - `family`: حجم عائلي ملكي | **85 ر.س** | تكفي 8 إلى 10 أشخاص (صينية عائلية فاخرة)
- **Short Description:** بريوش فرنسي مخمر ببطء ومجدول بحشوة نوتيلا إيطالية غنية تعلوه حبات جوز البيكان الأمريكي المحمص ورشة شوكولاتة ذائبة.
- **Long Description:** درة تاج مخبوزات هشوشة؛ نسيج بريوش قطني هش يُعجن بالزبدة الطبيعية، ويحتضن طبقات سخية وكثيفة من شوكولاتة النوتيلا الفاخرة مع قرمشة حبات البيكان الذهبية المحمصة بعناية. تمنحكم توازناً استثنائياً بين حلاوة الشوكولاتة ونكهة المكسرات الدافئة، مثالية لتجمعات القهوة والضيافة الراقية.
- **Slug:** `babka-nutella-pecan`
- **SEO Title:** بابكا نوتيلا وبيكان طازجة بالرياض | هشوشة للمخبوزات الفاخرة
- **SEO Description:** اطلب بابكا نوتيلا وبيكان طازجة ومجدولة بالزبدة الطبيعية وجوز البيكان المحمص. متوفرة بحجم ميني ووسط وعائلي مع توصيل مجهز بالرياض.
- **Badges:** `["signature", "popular", "sweet"]`

#### 2. بابكا بيستو وصنوبر (Pesto & Pine Nuts Babka)
- **ID:** `babka-pesto`
- **Category:** `savory-babka` (also matches `plain-dough-babka`)
- **Image:** `/images/dishes/babka-mini-pesto.png`
- **Variants:**
  - `mini`: ميني (فردي) | **12 ر.س** | تكفي شخص واحد
  - `medium`: حجم وسط | **50 ر.س** | تكفي 4 إلى 6 أشخاص (صينية 20 سم)
  - `family`: حجم عائلي ملكي | **85 ر.س** | تكفي 8 إلى 10 أشخاص (صينية عائلية فاخرة)
- **Short Description:** بريوش فرنسي مجدول ومحشو ببيستو الريحان الإيطالي الفاخر والصنوبر الذهبي المحمص وجبنة بارميزان معتقة وزيت زيتون بكر.
- **Long Description:** تحفة إيطالية كلاسيكية بلمسة هشوشة الحرفية؛ تُعجن بطحين فاخر وزبدة طبيعية نقية، ثم تُجدل بطبقات سخية من بيستو الريحان العطري الطازج الممزوج بالصنوبر الذهبي وجبنة البارميزان المعتقة وزيت الزيتون البكر، لتمنحكم نكهة عشبية دافئة وقواماً قطنياً يذوب في الفم.
- **Slug:** `babka-pesto-pine-nuts`
- **SEO Title:** بابكا بيستو وصنوبر طازجة بالرياض | هشوشة للمخبوزات الفاخرة
- **SEO Description:** بابكا بيستو الريحان الإيطالي والصنوبر المحمص وجبنة البارميزان، تُخبز يومياً في الرياض. متوفرة بحجم ميني ووسط وعائلي.
- **Badges:** `["signature", "savory"]`

#### 3. بابكا سينابون (Cinnabon Brioche Babka)
- **ID:** `babka-cinnabon`
- **Category:** `sweet-babka` (also matches `plain-dough-babka`)
- **Image:** `/images/dishes/babka-mini-cinnabon.png`
- **Variants:**
  - `mini`: ميني (فردي) | **10 ر.س** | تكفي شخص واحد
  - `medium`: حجم وسط | **40 ر.س** | تكفي 4 إلى 6 أشخاص (صينية وسط 20 سم)
  - `family`: حجم عائلي ملكي | **75 ر.س** | تكفي 8 إلى 10 أشخاص (صينية عائلية)
- **Short Description:** جدائل بريوش ذهبية هشة غنية بالقرفة السيلانية الفاخرة والسكر البني، متوجة بصوص الجبن الكريمي الأبيض.
- **Long Description:** دفء القرفة السيلانية الفاخرة في قالب بريوش مجدول بعناية؛ طبقات متداخلة من الزبدة والسكر البني المكرمل وعبق القرفة، تتوج بعد الخبز مباشرة بصوص كريمة الجبن الفاخرة المنسابة بين الجدائل لتمنحكم تجربة سينابون فندقية تذوب في الفم.
- **Slug:** `babka-cinnabon`
- **SEO Title:** بابكا سينابون بالقرفة وصوص الجبن بالرياض | هشوشة
- **SEO Description:** بابكا سينابون طازجة بالقرفة السيلانية الفاخرة وصوص الجبن الكريمي، متوفرة بحجم ميني ووسط وعائلي بالرياض.
- **Badges:** `["popular", "sweet"]`

#### 4. بابكا كاسترد وشوكولاتة (Custard & Chocolate Babka)
- **ID:** `babka-custard-chocolate`
- **Category:** `cocoa-dough-babka` (also matches `sweet-babka`)
- **Image:** `/images/dishes/babka-mini-custard-chocolate.png`
- **Variants:**
  - `mini`: ميني (فردي) | **10 ر.س** | تكفي شخص واحد
  - `medium`: حجم وسط | **40 ر.س** | تكفي 4 إلى 6 أشخاص (صينية وسط 20 سم)
  - `family`: حجم عائلي ملكي | **75 ر.س** | تكفي 8 إلى 10 أشخاص (صينية عائلية)
- **Short Description:** بريوش الكاكاو الهولندي الفاخر محشو بكاسترد الفانيليا الفرنسية الحريري وخطوط الشوكولاتة البلجيكية الغنية.
- **Long Description:** سيمفونية مخملية تجمع بين عجين الكاكاو الداكن المخمر ببطء وحشوة كاسترد الفانيليا الفرنسية الطازجة التي تُعد يدوياً، تتخللها قطرات الشوكولاتة البلجيكية الذائبة لتقدم لكم نكهة فاخرة لا تُقاوم مع القهوة.
- **Slug:** `babka-custard-chocolate`
- **SEO Title:** بابكا كاسترد وشوكولاتة بلجيكية بالرياض | هشوشة
- **SEO Description:** بابكا كاسترد الفانيليا والشوكولاتة البلجيكية بعجين الكاكاو، مخبوزة طازجة يومياً لجمعاتكم في الرياض.
- **Badges:** `["new", "sweet"]`

#### 5. بابكا أجبان مشكلة (Artisanal Triple Cheese Babka)
- **ID:** `babka-cheese`
- **Category:** `savory-babka` (also matches `plain-dough-babka`)
- **Image:** `/images/dishes/babka-mini-cheese.png`
- **Variants:**
  - `mini`: ميني (فردي) | **10 ر.س** | تكفي شخص واحد
  - `medium`: حجم وسط (صينية أجبان مشكلة) | **40 ر.س** | تكفي 4 إلى 6 أشخاص
  - `family`: حجم عائلي ملكي (صينية أجبان مشكلة) | **75 ر.س** | تكفي 8 إلى 10 أشخاص
- **Short Description:** بريوش الزبدة الطبيعية الغني بمزيج أجبان عكاوي وموزاريلا وقشقوان، تعلوه رشة حبة البركة والسمسم المحمص.
- **Long Description:** الدفء الصباحي في أبهى صوره؛ جدائل بريوش ذهبية هشة تحتضن توليفة متناغمة من ثلاثة أجبان فاخرة تذوب مع حرارة الخبز، وتتوج بحبة البركة والسمسم المحمص لتكون رفيقة مثالية لمائدة الإفطار والجمعات.
- **Slug:** `babka-triple-cheese`
- **SEO Title:** بابكا أجبان مشكلة ساخنة بالرياض | هشوشة للمخبوزات
- **SEO Description:** بابكا أجبان فاخرة بمزيج العكاوي والموزاريلا والقشقوان مع حبة البركة والسمسم. متوفرة بحجم ميني ووسط وعائلي بالرياض.
- **Badges:** `["popular", "savory"]`

#### 6. بابكا بيتزا إيطالية (Italian Pizza Babka)
- **ID:** `babka-pizza`
- **Category:** `savory-babka` (also matches `plain-dough-babka`)
- **Image:** `/images/dishes/babka-mini-pizza.png`
- **Variants:**
  - `mini`: ميني (فردي) | **10 ر.س** | تكفي شخص واحد
  - `medium`: حجم وسط (صينية بيتزا إيطالية) | **40 ر.س** | تكفي 4 إلى 6 أشخاص
  - `family`: حجم عائلي ملكي (صينية بيتزا إيطالية) | **75 ر.س** | تكفي 8 إلى 10 أشخاص
- **Short Description:** نكهة البيتزا النابولية الأصيلة في قالب بريوش مجدول؛ صلصة طماطم متبلة، موزاريلا ذائبة، زيتون أسود وأوريغانو بري.
- **Long Description:** ابتكار عصري يجمع بين ليونة البريوش الحرفي ونكهة البيتزا المحبوبة؛ صلصة طماطم مطهوة ببطء مع الأعشاب الإيطالية وجبنة موزاريلا تسيل برقة بين الجدائل المحمرة بإتقان، مزينة بالزيتون الأسود وحبات الطماطم الكرزية.
- **Slug:** `babka-italian-pizza`
- **SEO Title:** بابكا بيتزا إيطالية بالموزاريلا والأوريغانو بالرياض | هشوشة
- **SEO Description:** بابكا بنكهة البيتزا الإيطالية وجبنة الموزاريلا المذابة والأوريغانو. متوفرة بحجم ميني ووسط وعائلي بالرياض.
- **Badges:** `["savory"]`

#### 7. بابكا زعتر ولبنة (Zaatar & Labneh Babka)
- **ID:** `babka-zaatar-labneh`
- **Category:** `savory-babka` (also matches `plain-dough-babka`)
- **Image:** `/images/dishes/babka-mini-zaatar-labneh.png`
- **Variants:**
  - `mini`: ميني (فردي) | **10 ر.س** | تكفي شخص واحد
  - `medium`: حجم وسط (صينية زعتر فاخر) | **40 ر.س** | تكفي 4 إلى 6 أشخاص
  - `family`: حجم عائلي ملكي (صينية زعتر فاخر) | **75 ر.س** | تكفي 8 إلى 10 أشخاص
- **Short Description:** مزيج الزعتر الفلسطيني البري مع زيت الزيتون البكر ولمسة لبنة بلدية كريمية في جدائل بريوش هشة ومحمصة.
- **Long Description:** أصالة النكهة الشرقية بأسلوب الخبز الفرنسي المعاصر؛ زعتر بري بلدي برائحته النفاذة ممتزج بزيت الزيتون المعصور على البارد، يعانق جدائل البريوش المدهونة باللبنة البلدية الكريمية لتمنحكم نكهة صباحية لا تُنسى.
- **Slug:** `babka-zaatar-labneh`
- **SEO Title:** بابكا زعتر بري وزيت زيتون بكر بالرياض | هشوشة
- **SEO Description:** بابكا الزعتر البري واللبنة البلدية بزيت الزيتون البكر، تُخبز يومياً بالرياض لمائدة الإفطار والجمعات.
- **Badges:** `["savory"]`

---

### 2.2 بوكسات الضيافة الملكية (`babka-boxes` - منتجات مستقلة)

#### 8. بوكس بابكا بيستو حجم عائلي (24 قطعة)
- **ID:** `box-babka-pesto-24`
- **Category:** `babka-boxes`
- **Price:** **90 ر.س**
- **Serving Capacity:** تكفي 10 إلى 14 شخص (24 قطعة ميني)
- **Image:** `/images/dishes/babka-box-pesto-24.png`
- **Short Description:** بوكس ضيافة فاخر يحتوي على 24 قطعة بابكا ميني ببيستو الريحان والصنوبر المحمص والبارميزان.
- **Long Description:** مصمم خصيصاً للمجالس والجمعات الراقية؛ 24 قطعة ميني بابكا بيستو طازجة مصفوفة بعناية داخل بوكس هشوشة الحراري الفاخر، تمنح ضيوفكم مذاقاً إيطالياً استثنائياً وتقديم يبيّض الوجه.
- **Slug:** `box-babka-pesto-24`
- **SEO Title:** بوكس بابكا بيستو عائلي 24 قطعة بالرياض | هشوشة
- **SEO Description:** بوكس ضيافة بابكا بيستو وصنوبر 24 قطعة ميني بالرياض، مثالي للجمعات والمناسبات بتقديم فندقي فاخر.
- **Badges:** `["signature", "savory", "popular"]`

#### 9. بوكس بابكا نوتيلا وبيكان حجم عائلي (24 قطعة)
- **ID:** `box-babka-nutella-pecan-24`
- **Category:** `babka-boxes`
- **Price:** **90 ر.س**
- **Serving Capacity:** تكفي 10 إلى 14 شخص (24 قطعة ميني)
- **Image:** `/images/dishes/babka-box-nutella-pecan-24.png`
- **Short Description:** بوكس ضيافة ملكي يضم 24 قطعة بابكا ميني بالشوكولاتة والنوتيلا الإيطالية وجوز البيكان الأمريكي المحمص.
- **Long Description:** الخيار الأول لعشاق الشوكولاتة في مناسبات الرياض؛ 24 قطعة ميني غنية بالنوتيلا وحبات البيكان المقرمشة في بوكس أنيق مهيأ للتقديم المباشر مع القهوة السعودية.
- **Slug:** `box-babka-nutella-pecan-24`
- **SEO Title:** بوكس بابكا نوتيلا وبيكان عائلي 24 قطعة بالرياض | هشوشة
- **SEO Description:** بوكس ضيافة بابكا نوتيلا وبيكان 24 قطعة ميني طازجة ومقرمشة، توصيل سريع لكافة أحياء الرياض.
- **Badges:** `["signature", "popular", "sweet"]`

#### 10. بوكس بابكا زعتر بيتزا أو أجبان عائلي (24 قطعة)
- **ID:** `box-babka-savory-assorted-24`
- **Category:** `babka-boxes`
- **Price:** **80 ر.س**
- **Serving Capacity:** تكفي 10 إلى 14 شخص (24 قطعة ميني)
- **Image:** `/images/dishes/babka-box-zaatar-pizza-cheese-24.png`
- **Short Description:** بوكس جمعات متكامل يجمع تشكيلة منوعة من 24 قطعة ميني: أجبان مشكلة، بيتزا إيطالية، وزعتر بلدي.
- **Long Description:** التشكيلة الأكثر طلباً لجمعات الإفطار والعصرية؛ توليفة متوازنة من 24 قطعة ميني تلبي جميع أذواق الضيوف بين دسامة الأجبان الثلاثة، حيوية البيتزا، وعراقة الزعتر وزيت الزيتون.
- **Slug:** `box-babka-savory-assorted-24`
- **SEO Title:** بوكس بابكا موالح مشكل 24 قطعة عائلي بالرياض | هشوشة
- **SEO Description:** بوكس ميني بابكا موالح مشكلة (أجبان، بيتزا، زعتر) 24 قطعة لجمعاتكم ومناسباتكم بالرياض.
- **Badges:** `["popular", "savory"]`

#### 11. بوكس بابكا سينابون أو كاسترد عائلي (24 قطعة)
- **ID:** `box-babka-cinnabon-custard-24`
- **Category:** `babka-boxes`
- **Price:** **80 ر.س**
- **Serving Capacity:** تكفي 10 إلى 14 شخص (24 قطعة ميني)
- **Image:** `/images/dishes/babka-box-cinnabon-custard-24.png`
- **Short Description:** بوكس حلى فاخر يحتوي على 24 قطعة ميني بتوليفة السينابون بالقرفة وصوص الجبن وكاسترد الشوكولاتة.
- **Long Description:** ضيافة دافئة وغنية بأشهى نكهات الحلى المحبوبة؛ 24 قطعة ميني محشوة بالقرفة السيلانية المكرملة وكاسترد الفانيليا الفرنسية لتكتمل بها جلسات الشاي والقهوة.
- **Slug:** `box-babka-cinnabon-custard-24`
- **SEO Title:** بوكس بابكا سينابون وكاسترد 24 قطعة بالرياض | هشوشة
- **SEO Description:** بوكس ضيافة حلى بابكا ميني سينابون وكاسترد 24 قطعة طازجة ومجهزة للتقديم بالرياض.
- **Badges:** `["sweet"]`

---

### 2.3 صنف الكوكيز الحرفي (`cookies`)

#### 12. كوكيز هشوشة الحرفي بالشوكولاتة البلجيكية (Artisanal Belgian Chocolate Cookies)
- **ID:** `hashousha-cookies`
- **Category:** `cookies`
- **Image:** `/images/dishes/add-removebg-preview.png`
- **Price:** **12 ر.س**
- **Variants:**
  - `single`: حبة واحدة فاخرة | **12 ر.س** | شخص واحد
  - `box-6`: بوكس 6 حبات | **65 ر.س** | تكفي 3 إلى 5 أشخاص
  - `box-12`: بوكس 12 حبة | **120 ر.س** | تكفي 6 إلى 10 أشخاص
- **Short Description:** كوكيز هشوشة الحرفي الكلاسيكي المخبوز بالزبدة الطبيعية وقطع الشوكولاتة البلجيكية ورشة ملح بحري.
- **Long Description:** قوام مقرمش من الأطراف وطري يذوب من الداخل (Fudgy & Chewy)؛ مخبوز بأجود أنواع الشوكولاتة البلجيكية ونكهة الفانيليا الغنية مع لمسة ملح بحري تبرز عمق الطعم.
- **Slug:** `hashousha-artisanal-cookies`
- **SEO Title:** كوكيز هشوشة الحرفي بالشوكولاتة البلجيكية بالرياض
- **SEO Description:** كوكيز هش وطري بقطع الشوكولاتة البلجيكية الفاخرة والزبدة الطبيعية، طازج يومياً بالرياض.
- **Badges:** `["signature", "popular", "sweet"]`

---

## 3. Database & System Invariants

1. **Supabase DDL**:
   ```sql
   ALTER TABLE dishes ADD COLUMN IF NOT EXISTS variants JSONB;

   DELETE FROM categories;
   INSERT INTO categories (id, name, english_name, slug, sort_order, is_active) VALUES
     ('plain-dough-babka', 'البابكا بعجين ساده', 'Plain Dough Babka', 'plain-dough-babka', 10, true),
     ('cocoa-dough-babka', 'البابكا بعجين كاكاو', 'Cocoa Dough Babka', 'cocoa-dough-babka', 20, true),
     ('sweet-babka', 'البابكا الحلوه', 'Sweet Babka', 'sweet-babka', 30, true),
     ('savory-babka', 'البابكا المالحة', 'Savory Babka', 'savory-babka', 40, true),
     ('babka-boxes', 'بوكسات البابكا', 'Babka Boxes', 'babka-boxes', 50, true),
     ('cookies', 'الكوكيز', 'Artisanal Cookies', 'cookies', 60, true);
   ```
2. **Cart Keying Architecture**:
   - `lineKey = variantId ? `${dishId}__${variantId}` : dishId`
   - Preserves independent line items for different sizes in `useCartStore`, `CheckoutModal`, and `KitchenDashboard`.
3. **TypeScript & Build Pass**:
   - Zero errors on `npx tsc --noEmit` and `npm run build`.

---

## 4. Acceptance Criteria
- [ ] Complete catalog consolidated from fragmented 19 items into 12 sovereign products with exact poster pricing.
- [ ] Dishes display interactive size selector pills and dynamic serving capacity badges (`Users` icon).
- [ ] Cart manages compound keys (`${dishId}__${variantId}`) accurately calculating subtotals and item counts.
- [ ] Order summaries and Kitchen Dashboard tickets prominently display size variant and serving capacity.
- [ ] Categories table and storefront filters strictly display the 6 official categories.
- [ ] Admin `ProductEditModal` supports multi-size toggle and variant management.
- [ ] `npm run build` exits with code 0.
