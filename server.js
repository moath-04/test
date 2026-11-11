// خادم بسيط: يعرض الصفحات ويحفظ الطلبات في ملف JSON
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ORDERS_FILE = path.join(__dirname, "data", "orders.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// المنتجات (بدل قاعدة بيانات للتبسيط)
const products = [
  { id: 1, name: "Pears Box", description: "Fresh green pears, 1kg", price: 10.99, image: "pears.jpg", featured: true },
  { id: 2, name: "Golden Pears", description: "Sweet golden pears, 500g", price: 8.5, image: "pears2.jpg" },
  { id: 3, name: "Mushrooms", description: "Organic brown mushrooms", price: 6.25, image: "mushrooms.jpg" },
  { id: 4, name: "Watermelon", description: "Whole local watermelon", price: 12.0, image: "watermelon.jpg" }
];

function readOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); }
  catch { return []; }
}
function saveOrders(orders) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// GET: قائمة المنتجات
app.get("/api/products", (req, res) => res.json(products));

// POST: إنشاء طلب جديد مع تحقق بسيط من المدخلات
app.post("/api/orders", (req, res) => {
  const { name, email, productId, quantity } = req.body || {};
  const product = products.find(p => p.id === Number(productId));
  const qty = Number(quantity);
  if (!name || !email || !email.includes("@") || !product || !(qty >= 1 && qty <= 20)) {
    return res.status(400).json({ error: "Please fill all fields correctly." });
  }
  const order = {
    id: Date.now(),
    name: String(name).slice(0, 80),
    email: String(email).slice(0, 120),
    product: product.name,
    quantity: qty,
    total: +(product.price * qty).toFixed(2),
    createdAt: new Date().toISOString()
  };
  const orders = readOrders();
  orders.push(order);
  saveOrders(orders);
  res.status(201).json(order);
});

// GET: كل الطلبات لصفحة المشرف
app.get("/api/orders", (req, res) => res.json(readOrders()));

app.listen(PORT, "0.0.0.0", () => console.log(`Shop running on port ${PORT}`));
