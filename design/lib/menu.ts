export type CategoryId = "all" | "warak" | "malfouf" | "trays" | "sweets"

export const categories: { id: CategoryId; label: string }[] = [
  { id: "all", label: "جميع الأطباق" },
  { id: "warak", label: "ورق عنب فاخر" },
  { id: "malfouf", label: "ملفوف دايب" },
  { id: "trays", label: "صواني الجمعات" },
  { id: "sweets", label: "حلويات وسويت" },
]

export type BadgeKind = "tangy" | "popular" | "spicy" | "new"

export type Dish = {
  id: string
  name: string
  englishName: string
  description: string
  price: number
  unit: string
  category: Exclude<CategoryId, "all">
  image: string
  badges: BadgeKind[]
}

export const dishes: Dish[] = [
  {
    id: "warak-classic",
    name: "ورق عنب حامض حلو",
    englishName: "Signature Vine Leaves",
    description: "ملفوف يدوياً بالأرز المتبّل، مطهو على نار هادئة بدبس الرمان وزيت الزيتون البكر.",
    price: 145,
    unit: "صينية ٥٠ حبة",
    category: "warak",
    image: "/images/warak-enab.png",
    badges: ["tangy", "popular"],
  },
  {
    id: "warak-box",
    name: "بوكس ورق عنب الضيافة",
    englishName: "Hospitality Box",
    description: "بوكس فاخر مرتّب بعناية، مع صوص دبس الرمان جانبياً — مثالي للإهداء.",
    price: 189,
    unit: "بوكس ٧٠ حبة",
    category: "warak",
    image: "/images/warak-box.png",
    badges: ["tangy"],
  },
  {
    id: "malfouf-spicy",
    name: "ملفوف دايب حار مسمسم",
    englishName: "Spiced Sesame Cabbage",
    description: "ملفوف ذائب في صلصة طماطم حارة غنية، يُزيَّن بالسمسم المحمّص ورقائق الفلفل.",
    price: 129,
    unit: "صينية ٤٠ حبة",
    category: "malfouf",
    image: "/images/malfouf.png",
    badges: ["spicy", "popular"],
  },
  {
    id: "majlis-tray",
    name: "صينية جمعة المجلس",
    englishName: "The Majlis Tray",
    description: "تشكيلة ورق عنب وكوسا محشي وملفوف، تكفي ٨–١٠ أشخاص لجمعاتكم العائلية.",
    price: 349,
    unit: "صينية كبيرة",
    category: "trays",
    image: "/images/tray.png",
    badges: ["popular"],
  },
  {
    id: "kunafa-box",
    name: "بوكس كنافة وبسبوسة",
    englishName: "Kunafa & Basbousa",
    description: "كنافة ذهبية مقرمشة وبسبوسة بالفستق الحلبي، بقطر الورد الخفيف.",
    price: 119,
    unit: "بوكس ٢٤ قطعة",
    category: "sweets",
    image: "/images/sweets.png",
    badges: ["new"],
  },
  {
    id: "date-cake",
    name: "كيكة التمر بالكراميل",
    englishName: "Sticky Date Cake",
    description: "كيكة تمر سكري طرية، بصوص كراميل مملّح وكريمة الزعفران.",
    price: 95,
    unit: "قالب ٨ شرائح",
    category: "sweets",
    image: "/images/date-cake.png",
    badges: ["popular"],
  },
]

export const WHATSAPP_NUMBER = "966500000000"

export function formatPrice(value: number) {
  return `${value.toLocaleString("ar-SA")} ر.س`
}
