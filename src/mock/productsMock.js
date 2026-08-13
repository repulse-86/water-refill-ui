const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockProducts = [
  { id: 1, name: 'Purified Water', type: 'water_refill', volume_gallons: 5, price: 25, stock_quantity: 100, reorder_point: 20 },
  { id: 2, name: 'Alkaline Water', type: 'water_refill', volume_gallons: 5, price: 35, stock_quantity: 50, reorder_point: 10 },
  { id: 3, name: 'Water Jug 5 Gal', type: 'accessory', volume_gallons: 5, price: 150, stock_quantity: 30, reorder_point: 5 },
  { id: 4, name: 'Cap', type: 'accessory', volume_gallons: null, price: 2, stock_quantity: 500, reorder_point: 100 },
  { id: 5, name: 'Seal', type: 'accessory', volume_gallons: null, price: 1, stock_quantity: 500, reorder_point: 100 },
  { id: 6, name: 'Dispenser', type: 'equipment', volume_gallons: null, price: 500, stock_quantity: 5, reorder_point: 1 },
];

export const billOfMaterials = {
  1: [
    { component_id: 4, quantity: 1 },
    { component_id: 5, quantity: 1 },
  ],
  2: [
    { component_id: 4, quantity: 1 },
    { component_id: 5, quantity: 1 },
  ],
};

let products = [...mockProducts];

let nextId = 7;

function deductStock(productId, quantity) {
  const index = products.findIndex((p) => p.id === Number(productId));
  if (index === -1) return;
  products[index] = {
    ...products[index],
    stock_quantity: Math.max(0, products[index].stock_quantity - Number(quantity)),
  };
}

export async function applySaleEffects(items) {
  await delay(200);
  (items || []).forEach((item) => {
    deductStock(item.product_id, item.quantity);
    const components = billOfMaterials[Number(item.product_id)];
    if (components) {
      components.forEach((component) => deductStock(component.component_id, component.quantity * Number(item.quantity)));
    }
  });
  return { success: true };
}

const clone = (p) => ({ ...p });

const validate = (payload = {}, excludeId = null) => {
  const errors = {};

  const name = payload.name?.trim();
  if (!name) {
    errors.name = ['The name field is required.'];
  } else if (products.some((p) => p.name.trim().toLowerCase() === name.toLowerCase() && p.id !== excludeId)) {
    errors.name = ['The name has already been taken.'];
  }

  if (!['water_refill', 'accessory', 'equipment'].includes(payload.type)) {
    errors.type = ['The type field is required.'];
  }

  const price = Number(payload.price);
  if (payload.price === '' || Number.isNaN(price) || price < 0) {
    errors.price = ['The price must be a positive number.'];
  }

  const stock = Number(payload.stock_quantity);
  if (payload.stock_quantity === '' || Number.isNaN(stock) || stock < 0) {
    errors.stock_quantity = ['The stock quantity must be a positive number.'];
  }

  const reorder = Number(payload.reorder_point);
  if (payload.reorder_point === '' || Number.isNaN(reorder) || reorder < 0) {
    errors.reorder_point = ['The reorder point must be a positive number.'];
  }

  if (payload.type === 'water_refill') {
    const volume = Number(payload.volume_gallons);
    if (payload.volume_gallons === '' || Number.isNaN(volume) || volume <= 0) {
      errors.volume_gallons = ['The volume must be a positive number.'];
    }
  }

  return errors;
};

export async function listProducts() {
  await delay(300);
  return products.map(clone);
}

export async function createProduct(payload) {
  await delay(500);

  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    throw { message: 'The given data was invalid.', errors };
  }

  const product = {
    id: nextId++,
    name: payload.name.trim(),
    type: payload.type,
    volume_gallons: payload.type === 'water_refill' ? Number(payload.volume_gallons) : null,
    price: Number(payload.price),
    stock_quantity: Number(payload.stock_quantity),
    reorder_point: Number(payload.reorder_point),
  };
  products.push(product);
  return clone(product);
}

export async function updateProduct(id, payload) {
  await delay(500);

  const errors = validate(payload, id);
  if (Object.keys(errors).length > 0) {
    throw { message: 'The given data was invalid.', errors };
  }

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    throw { message: 'Product not found.' };
  }

  products[index] = {
    ...products[index],
    name: payload.name.trim(),
    type: payload.type,
    volume_gallons: payload.type === 'water_refill' ? Number(payload.volume_gallons) : null,
    price: Number(payload.price),
    stock_quantity: Number(payload.stock_quantity),
    reorder_point: Number(payload.reorder_point),
  };
  return clone(products[index]);
}

export async function deleteProduct(id) {
  await delay(300);

  products = products.filter((p) => p.id !== id);
  return { success: true };
}