// يجلب المنتجات من الخادم ويعرضها، ويرسل نموذج الطلب
const emoji = { "pears.jpg": "🍐", "pears2.jpg": "🍐", "mushrooms.jpg": "🍄", "watermelon.jpg": "🍉" };

function card(p) {
  return `<div class="card"><div class="img" style="background-image:url(images/${p.image})">${emoji[p.image] || ""}</div>
    <h3>${p.name}</h3><p>${p.description}</p><div class="price">$${p.price.toFixed(2)}</div></div>`;
}

async function loadProducts() {
  const products = await (await fetch("/api/products")).json();
  const featured = products.find(p => p.featured);
  const others = products.filter(p => !p.featured).slice(0, 2);
  document.getElementById("product-grid").innerHTML =
    `<div class="featured">${card(featured)}</div><div class="side">${others.map(card).join("")}</div>`;
  document.getElementById("product-select").innerHTML =
    products.map(p => `<option value="${p.id}">${p.name} — $${p.price}</option>`).join("");
}

document.getElementById("order").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("msg");
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const body = await res.json();
  msg.textContent = res.ok ? `✅ Order received! Total: $${body.total}` : `❌ ${body.error}`;
  if (res.ok) e.target.reset();
});

loadProducts();
