import { getOne, update } from "./api.js";

const id = new URLSearchParams(window.location.search).get("id");

async function load() {
  try {
    const r = await getOne(id);
    const form = document.getElementById("form");
    form.name.value = r.name;
    form.brand.value = r.brand;
    form.category.value = r.category;
    form.stock.value = r.stock;
    form.price.value = r.price;
    form.available.checked = r.available === true || r.available === "true";
  } catch (e) {
    document.getElementById("error").textContent = `Error al cargar el registro: ${e.message}`;
    document.getElementById("error").classList.remove("hidden");
  }
}

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submit-btn");
  btn.disabled = true;
  btn.textContent = "Guardando...";

  const data = new FormData(e.target);
  const payload = {
    name: data.get("name"),
    brand: data.get("brand"),
    category: data.get("category"),
    stock: parseInt(data.get("stock"), 10),
    price: parseFloat(data.get("price")),
    available: e.target.available.checked,
  };

  try {
    await update(id, payload);
    window.location.href = "index.html";
  } catch (e) {
    document.getElementById("error").textContent = `Error al actualizar: ${e.message}`;
    document.getElementById("error").classList.remove("hidden");
    btn.disabled = false;
    btn.textContent = "Guardar cambios";
  }
});

load();
