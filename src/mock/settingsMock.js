const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const defaultSettings = {
  store_name: 'My Water Refilling Station',
  store_address: '',
  store_phone: '',
  currency: 'PHP',
  low_stock_threshold: 10,
};

const validate = (payload = {}) => {
  const errors = {};

  if (!payload.store_name?.trim()) {
    errors.store_name = ['The store name field is required.'];
  }

  if (!payload.currency) {
    errors.currency = ['The currency field is required.'];
  }

  const threshold = Number(payload.low_stock_threshold);
  if (payload.low_stock_threshold === '' || Number.isNaN(threshold) || threshold < 0) {
    errors.low_stock_threshold = ['The low stock threshold must be a positive number.'];
  }

  return errors;
};

export async function getSettings() {
  await delay(300);
  return { ...defaultSettings };
}

export async function updateSettings(payload) {
  await delay(500);

  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    throw {
      message: 'The given data was invalid.',
      errors,
    };
  }

  return {
    ...defaultSettings,
    ...payload,
  };
}