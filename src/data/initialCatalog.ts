import { Category, Product } from '../types/product';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'all',
    nameAr: 'جميع الأطباق',
    nameEn: 'All Dishes',
    icon: 'UtensilsCrossed',
    sortOrder: 0,
    isActive: true,
  },
  {
    id: 'vine-leaves',
    nameAr: 'ورق عنب فاخر',
    nameEn: 'Gourmet Vine Leaves',
    icon: 'Leaf',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cabbage-rolls',
    nameAr: 'ملفوف دايب',
    nameEn: 'Tender Cabbage Rolls',
    icon: 'Soup',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'platters',
    nameAr: 'صواني وبوكسات الجمعات',
    nameEn: 'Gathering Platters',
    icon: 'Layers',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'desserts',
    nameAr: 'حلويات وسويت',
    nameEn: 'Artisanal Desserts',
    icon: 'Cookie',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'appetizers',
    nameAr: 'مقبلات وسلطات',
    nameEn: 'Appetizers & Salads',
    icon: 'Salad',
    sortOrder: 5,
    isActive: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'dish-vine-leaves-pomegranate',
    categoryId: 'vine-leaves',
    nameAr: 'ورق عنب فاخر بدبس الرمان',
    nameEn: 'Luxury Pomegranate Vine Leaves',
    descriptionAr:
      'ورق عنب طازج متبل بالخلطة السرية الغنية، مغمور بدبس الرمان الطبيعي المركز وقطع الليمون الطازج وزيت الزيتون البكر.',
    descriptionEn:
      'Fresh handmade vine leaves stuffed with seasoned aromatic rice, slow-simmered in rich pomegranate molasses and extra virgin olive oil.',
    basePrice: 32.5,
    image: '/images/warak-enab.png',
    badge: 'signature',
    servingsInfoAr: 'بوكس ٢٥ حبة',
    prepTimeMinutes: 30,
    inStock: true,
    optionGroups: [
      {
        id: 'portion-size',
        nameAr: 'الحجم والكمية',
        nameEn: 'Portion Size',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'portion-25',
            nameAr: 'بوكس وسط (25 حبة)',
            nameEn: 'Medium Box (25 pcs)',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'portion-50',
            nameAr: 'بوكس كبير (50 حبة)',
            nameEn: 'Large Box (50 pcs)',
            priceDelta: 30,
          },
          {
            id: 'portion-100',
            nameAr: 'صينية ولائم (100 حبة)',
            nameEn: 'Gathering Platter (100 pcs)',
            priceDelta: 85,
          },
        ],
      },
      {
        id: 'spiciness',
        nameAr: 'درجة الحرارة والتتبيلة',
        nameEn: 'Spiciness Level',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'spice-regular',
            nameAr: 'عادي (نكهة معتدلة)',
            nameEn: 'Regular Mild',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'spice-spicy',
            nameAr: 'حار سبايسي',
            nameEn: 'Spicy',
            priceDelta: 0,
          },
        ],
      },
      {
        id: 'add-ons',
        nameAr: 'الصوصات والإضافات الذواقة',
        nameEn: 'Sauces & Add-ons',
        type: 'multiple',
        required: false,
        choices: [
          {
            id: 'addon-pomegranate',
            nameAr: 'دبس رمان طبيعي إضافي',
            nameEn: 'Extra Pomegranate Molasses',
            priceDelta: 5,
          },
          {
            id: 'addon-tahini',
            nameAr: 'صوص طحينة بالليمون',
            nameEn: 'Lemon Tahini Sauce',
            priceDelta: 7,
          },
        ],
      },
    ],
  },
  {
    id: 'dish-cabbage-rolls-ghee',
    categoryId: 'cabbage-rolls',
    nameAr: 'ملفوف دايب بالسمن البلدي',
    nameEn: 'Tender Cabbage Rolls with Pure Ghee',
    descriptionAr:
      'ملفوف أبيض طري يذوب في الفم، محشو بالأرز المتبل بخلطة الثوم والكمون والنعناع مع لمسة سمن بلدي فاخر.',
    descriptionEn:
      'Melt-in-mouth tender white cabbage rolls stuffed with garlic and cumin scented rice, enriched with golden pure ghee.',
    basePrice: 28.0,
    image: '/images/malfouf.png',
    badge: 'bestseller',
    servingsInfoAr: 'بوكس ٣٠ حبة',
    prepTimeMinutes: 35,
    inStock: true,
    optionGroups: [
      {
        id: 'portion-size',
        nameAr: 'الحجم والكمية',
        nameEn: 'Portion Size',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'cabbage-portion-30',
            nameAr: 'بوكس وسط (30 حبة)',
            nameEn: 'Medium Box (30 pcs)',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'cabbage-portion-60',
            nameAr: 'بوكس عائلي (60 حبة)',
            nameEn: 'Family Box (60 pcs)',
            priceDelta: 32,
          },
        ],
      },
      {
        id: 'spiciness',
        nameAr: 'درجة الحرارة',
        nameEn: 'Spiciness',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'cabbage-spice-regular',
            nameAr: 'عادي بالسمن البلدي',
            nameEn: 'Original Mild',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'cabbage-spice-spicy',
            nameAr: 'حار سبايسي',
            nameEn: 'Spicy',
            priceDelta: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'dish-vine-leaves-classic',
    categoryId: 'vine-leaves',
    nameAr: 'ورق عنب كلاسيك بالليمون',
    nameEn: 'Classic Lemon Stuffed Vine Leaves',
    descriptionAr:
      'النكهة التراثية الأصلية لورق العنب مع عصير الليمون الطبيعي وزيت الزيتون الصافي وأوراق النعناع.',
    descriptionEn:
      'Traditional heritage vine leaves with refreshing cold-pressed lemon juice, extra virgin olive oil, and fresh mint.',
    basePrice: 25.99,
    image: '/images/warak-box.png',
    servingsInfoAr: 'بوكس ٢٥ حبة',
    prepTimeMinutes: 30,
    inStock: true,
    optionGroups: [
      {
        id: 'portion-size',
        nameAr: 'الحجم والكمية',
        nameEn: 'Portion Size',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'classic-25',
            nameAr: 'بوكس وسط (25 حبة)',
            nameEn: 'Medium Box (25 pcs)',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'classic-50',
            nameAr: 'بوكس كبير (50 حبة)',
            nameEn: 'Large Box (50 pcs)',
            priceDelta: 28,
          },
        ],
      },
    ],
  },
  {
    id: 'dish-vine-leaves-spicy',
    categoryId: 'vine-leaves',
    nameAr: 'ورق عنب سبايسي نار',
    nameEn: 'Fire Spicy Stuffed Vine Leaves',
    descriptionAr:
      'لعشاق النكهات الحارة الجريئة! ورق عنب متبل بخلطة الفلفل الأحمر الحار والشطة الخاصة مع دبس الرمان.',
    descriptionEn:
      'For spicy food lovers! Seasoned with roasted red chili flakes, special hot pepper sauce, and tangy pomegranate syrup.',
    basePrice: 29.99,
    image: '/images/warak-enab.png',
    badge: 'spicy',
    spicyLevel: 'spicy',
    servingsInfoAr: 'بوكس ٢٥ حبة',
    prepTimeMinutes: 30,
    inStock: true,
    optionGroups: [
      {
        id: 'portion-size',
        nameAr: 'الحجم والكمية',
        nameEn: 'Portion Size',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'spicy-25',
            nameAr: 'بوكس وسط (25 حبة)',
            nameEn: 'Medium Box (25 pcs)',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'spicy-50',
            nameAr: 'بوكس عائلي (50 حبة)',
            nameEn: 'Family Box (50 pcs)',
            priceDelta: 30,
          },
        ],
      },
      {
        id: 'spiciness-level',
        nameAr: 'مستوى الحرارة',
        nameEn: 'Heat Level',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'heat-spicy',
            nameAr: 'حار مسمسم',
            nameEn: 'Spicy Level 1',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'heat-fire',
            nameAr: 'نار إضافي',
            nameEn: 'Extra Hot Level 2',
            priceDelta: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'dish-platter-mixed-hashousha',
    categoryId: 'platters',
    nameAr: 'صينية هشوشة المشكلة (ورق عنب + ملفوف)',
    nameEn: 'Hashousha Signature Mixed Platter',
    descriptionAr:
      'صينية متكاملة تجمع بين ألذ أصنافنا: 30 حبة ورق عنب بدبس الرمان + 30 حبة ملفوف دايب مع صوصات التغميس الخاصة.',
    descriptionEn:
      'The ultimate feast: 30 pieces of pomegranate vine leaves + 30 pieces of melt-in-mouth cabbage rolls with signature dipping sauces.',
    basePrice: 85.0,
    image: '/images/tray.png',
    badge: 'bestseller',
    servingsInfoAr: 'صينية ٦٠ حبة (تكفي ٦-٨ أشخاص)',
    prepTimeMinutes: 45,
    inStock: true,
    optionGroups: [
      {
        id: 'portion-size',
        nameAr: 'حجم الصينية',
        nameEn: 'Platter Size',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'platter-60',
            nameAr: 'صينية مشكلة (60 حبة)',
            nameEn: 'Mixed Platter (60 pcs)',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'platter-100',
            nameAr: 'صينية ولائم فاخرة (100 حبة)',
            nameEn: 'Royal Feast Platter (100 pcs)',
            priceDelta: 65,
          },
        ],
      },
      {
        id: 'flavor-profile',
        nameAr: 'توزيع النكهة',
        nameEn: 'Flavor Profile',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'flavor-half',
            nameAr: 'نصف عادي ونصف سبايسي',
            nameEn: 'Half Regular & Half Spicy',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'flavor-regular',
            nameAr: 'كامل عادي معتدل',
            nameEn: 'All Regular Mild',
            priceDelta: 0,
          },
          {
            id: 'flavor-spicy',
            nameAr: 'كامل سبايسي حار',
            nameEn: 'All Spicy Hot',
            priceDelta: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'dish-dessert-homemade-cookies',
    categoryId: 'desserts',
    nameAr: 'كوكيز شوكولاتة منزلي فاخر',
    nameEn: 'Artisanal Homemade Chocolate Cookies',
    descriptionAr:
      'كوكيز طازج مخبوز بحب، مقرمش من الأطراف وطري وغني بقطع الشوكولاتة البلجيكية من الداخل.',
    descriptionEn:
      'Freshly baked artisanal cookies, crispy around the edges and delightfully chewy inside, loaded with Belgian chocolate chunks.',
    basePrice: 18.75,
    image: '/images/sweets.png',
    badge: 'new',
    servingsInfoAr: 'بوكس ٦ قطع كبيرة',
    prepTimeMinutes: 20,
    inStock: true,
    optionGroups: [
      {
        id: 'portion-size',
        nameAr: 'الكمية',
        nameEn: 'Quantity',
        type: 'single',
        required: true,
        choices: [
          {
            id: 'cookies-6',
            nameAr: 'بوكس 6 حبات',
            nameEn: 'Box of 6',
            priceDelta: 0,
            isDefault: true,
          },
          {
            id: 'cookies-12',
            nameAr: 'بوكس دزينة (12 حبة)',
            nameEn: 'Box of 12',
            priceDelta: 16,
          },
        ],
      },
    ],
  },
  {
    id: 'dish-dessert-om-ali',
    categoryId: 'desserts',
    nameAr: 'أم علي ملكية بالمكسرات والقشطة',
    nameEn: 'Royal Um Ali with Roasted Nuts & Cream',
    descriptionAr:
      'حلوى أم علي التراثية الساخنة بعجينة الميلفاي الهشة والحليب الطازج المغطى بالمكسرات المحمصة والقشطة البلدية.',
    descriptionEn:
      'Warm traditional dessert with golden puff pastry, sweetened infused milk, roasted pistachios, almonds, and clotted cream.',
    basePrice: 35.0,
    image: '/images/date-cake.png',
    servingsInfoAr: 'طاجن فخاري لشخصين',
    prepTimeMinutes: 25,
    inStock: true,
    optionGroups: [
      {
        id: 'toppings',
        nameAr: 'إضافات التزيين الفاخرة',
        nameEn: 'Gourmet Toppings',
        type: 'multiple',
        required: false,
        choices: [
          {
            id: 'omali-nuts',
            nameAr: 'مكسرات محمصة إضافية (فستق ولوز)',
            nameEn: 'Extra Roasted Pistachios & Almonds',
            priceDelta: 6,
          },
          {
            id: 'omali-cream',
            nameAr: 'قشطة بلدية طازجة إضافية',
            nameEn: 'Extra Fresh Clotted Cream',
            priceDelta: 5,
          },
        ],
      },
    ],
  },
  {
    id: 'dish-appetizer-tabbouleh',
    categoryId: 'appetizers',
    nameAr: 'سلطة تبولة خضراء بالرمان',
    nameEn: 'Fresh Green Tabbouleh with Pomegranate',
    descriptionAr:
      'تبولة لبنانية منعشة بالبقدونس البلدي والنعناع والبرغل الناعم وزيت الزيتون مع حبات الرمان الطازجة.',
    descriptionEn:
      'Refreshing Mediterranean parsley and fresh mint salad with fine cracked wheat, extra virgin olive oil, and tart pomegranate seeds.',
    basePrice: 22.0,
    image: '/images/dishes/icons8-about-us-400.svg',
    servingsInfoAr: 'صحن مقبلات لشخصين',
    prepTimeMinutes: 15,
    inStock: true,
    optionGroups: [
      {
        id: 'dressings',
        nameAr: 'التتبيلة والإضافات',
        nameEn: 'Dressings & Extras',
        type: 'multiple',
        required: false,
        choices: [
          {
            id: 'tabbouleh-extra-pomegranate',
            nameAr: 'دبس رمان مركز إضافي',
            nameEn: 'Extra Pomegranate Drizzle',
            priceDelta: 3,
          },
          {
            id: 'tabbouleh-extra-lemon',
            nameAr: 'زيت زيتون بكر وليمون إضافي',
            nameEn: 'Extra Olive Oil & Lemon',
            priceDelta: 3,
          },
        ],
      },
    ],
  },
];

export { dishes as V0_DISHES, categories as V0_CATEGORIES } from './menu';

