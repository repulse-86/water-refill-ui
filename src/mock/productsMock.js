const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockProducts = [
  {
    id: 1,
    name: 'Purified Water',
    type: 'water_refill',
    volume_gallons: 5,
    price: 25,
    stock_quantity: 100,
    reorder_point: 20,
    components: [
      { component_id: 4, component_name: 'Cap', quantity: 1 },
      { component_id: 5, component_name: 'Seal', quantity: 1 },
    ],
  },
  {
    id: 2,
    name: 'Alkaline Water',
    type: 'water_refill',
    volume_gallons: 5,
    price: 35,
    stock_quantity: 50,
    reorder_point: 10,
    components: [
      { component_id: 4, component_name: 'Cap', quantity: 1 },
      { component_id: 5, component_name: 'Seal', quantity: 1 },
    ],
  },
  { id: 3, name: 'Water Jug 5 Gal', type: 'accessory', volume_gallons: 5, price: 150, stock_quantity: 30, reorder_point: 5 },
  { id: 4, name: 'Cap', type: 'accessory', volume_gallons: null, price: 2, stock_quantity: 500, reorder_point: 100 },
  { id: 5, name: 'Seal', type: 'accessory', volume_gallons: null, price: 1, stock_quantity: 500, reorder_point: 100 },
  { id: 6, name: 'Dispenser', type: 'equipment', volume_gallons: null, price: 500, stock_quantity: 0, reorder_point: 1 },
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

const archivedProducts = [];
let nextId = 7;

const clone = (product) => ({
  ...product,
  components: [...(product.components || [])],
});

const clonePublic = (product) => {
  const { components: _removed, ...publicProduct } = product;
  return { ...publicProduct };
};

const findProduct = (id) => mockProducts.find((product) => product.id === Number(id));

const findComponentName = (id) => {
  const productId = Number(id);
  return mockProducts.find((product) => product.id === productId)?.name ?? archivedProducts.find((product) => product.id === productId)?.name ?? 'Unknown';
};

const normalizeComponents = (components = [], excludeId = null) => {
  const seen = new Set();

  return (components || [])
    .map((component) => ({
      component_id: Number(component.component_id),
      component_name: component.component_name ?? 'Unknown',
      quantity: Math.max(1, Number(component.quantity) || 1),
    }))
    .filter((component) => {
      const isValid =
        Number.isInteger(component.component_id) &&
        component.component_id > 0 &&
        component.component_id !== Number(excludeId) &&
        findProduct(component.component_id) &&
        !seen.has(component.component_id);
      if (isValid) seen.add(component.component_id);
      return isValid;
    })
    .map((component) => ({
      ...component,
      component_name: findComponentName(component.component_id),
    }));
};

function deductStock(productId, quantity) {
  const index = mockProducts.findIndex((product) => product.id === Number(productId));
  if (index === -1) return;
  mockProducts[index] = {
    ...mockProducts[index],
    stock_quantity: Math.max(0, mockProducts[index].stock_quantity - Number(quantity)),
  };
}

export async function applySaleEffects(items) {
  await delay(200);
  (items || []).forEach((item) => {
    const product = findProduct(item.product_id);
    deductStock(item.product_id, item.quantity);
    const components = product?.components || billOfMaterials[Number(item.product_id)] || [];
    components.forEach((component) => deductStock(component.component_id, component.quantity * Number(item.quantity)));
  });
  return { success: true };
}

const validate = (payload = {}, excludeId = null) => {
  const errors = {};

  const name = payload.name?.trim();
  if (!name) {
    errors.name = ['The name field is required.'];
  } else if (mockProducts.some((product) => product.name.trim().toLowerCase() === name.toLowerCase() && product.id !== excludeId)) {
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

  if (payload.components !== undefined) {
    const components = normalizeComponents(payload.components, excludeId);
    if (components.length !== (payload.components || []).length) {
      errors.components = ['Components must be unique active products other than this product.'];
    }
  }

  return errors;
};

export function getProducts() {
  return mockProducts.map(clonePublic);
}

export async function listProducts() {
  await delay(300);
  return mockProducts.map(clonePublic);
}

export async function listProductComponents(productId) {
  await delay(200);
  return (billOfMaterials[Number(productId)] || []).map((component) => ({
    ...component,
    component_name: findComponentName(component.component_id),
  }));
}

export async function listDeletedProducts() {
  await delay(300);
  return archivedProducts.map(clonePublic);
}

export async function createProduct(payload) {
  await delay(500);

  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    throw { message: 'The given data was invalid.', errors };
  }

  const components = normalizeComponents(payload.components);
  const product = {
    id: nextId++,
    name: payload.name.trim(),
    type: payload.type,
    volume_gallons: payload.type === 'water_refill' ? Number(payload.volume_gallons) : null,
    price: Number(payload.price),
    stock_quantity: Number(payload.stock_quantity),
    reorder_point: Number(payload.reorder_point),
    image: payload.image ?? null,
    components,
  };
  mockProducts.push(product);
  billOfMaterials[product.id] = product.components.map((component) => ({
    component_id: component.component_id,
    quantity: component.quantity,
  }));
  return clonePublic(product);
}

export async function updateProduct(id, payload) {
  await delay(500);

  const index = mockProducts.findIndex((product) => product.id === Number(id));
  if (index === -1) {
    throw { message: 'Product not found.', errors: {} };
  }

  const errors = validate(payload, id);
  if (Object.keys(errors).length > 0) {
    throw { message: 'The given data was invalid.', errors };
  }

  mockProducts[index] = {
    ...mockProducts[index],
    name: payload.name.trim(),
    type: payload.type,
    volume_gallons: payload.type === 'water_refill' ? Number(payload.volume_gallons) : null,
    price: Number(payload.price),
    stock_quantity: Number(payload.stock_quantity),
    reorder_point: Number(payload.reorder_point),
    image: payload.image ?? null,
    components: payload.components === undefined ? mockProducts[index].components : normalizeComponents(payload.components, id),
  };
  billOfMaterials[mockProducts[index].id] = mockProducts[index].components.map((component) => ({
    component_id: component.component_id,
    quantity: component.quantity,
  }));
  return clonePublic(mockProducts[index]);
}

export async function deleteProduct(id) {
  await delay(300);

  const index = mockProducts.findIndex((product) => product.id === Number(id));
  if (index === -1) {
    throw { message: 'Product not found.', errors: {} };
  }

  const [product] = mockProducts.splice(index, 1);
  archivedProducts.unshift({ ...clone(product), deleted_at: new Date().toISOString() });
  return { success: true };
}

export async function restoreProduct(id) {
  await delay(300);

  const index = archivedProducts.findIndex((product) => product.id === Number(id));
  if (index === -1) {
    throw { message: 'Product not found.', errors: {} };
  }

  const [product] = archivedProducts.splice(index, 1);
  const { deleted_at: _removed, ...restored } = product;
  mockProducts.push({ ...restored, components: [...(billOfMaterials[restored.id] || [])] });
  return clonePublic(restored);
}

export async function permanentDeleteProduct(id) {
  await delay(300);

  const index = archivedProducts.findIndex((product) => product.id === Number(id));
  if (index === -1) {
    throw { message: 'Product not found.', errors: {} };
  }

  archivedProducts.splice(index, 1);
  delete billOfMaterials[Number(id)];
  return { success: true };
}
