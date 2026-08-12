export const typeLabels = {
  water_refill: 'Water Refill',
  accessory: 'Accessory',
  equipment: 'Equipment',
};

export const typeBadgeVariants = {
  water_refill: 'blue',
  accessory: 'slate',
  equipment: 'violet',
};

export const productRules = {
  name: {
    required: 'The name field is required.',
  },
  type: {
    required: 'The type field is required.',
  },
  volume_gallons: {
    required: 'The volume field is required.',
    min: { value: 0.01, message: 'The volume must be a positive number.' },
  },
  price: {
    required: 'The price field is required.',
    min: { value: 0, message: 'The price must be a positive number.' },
  },
  stock_quantity: {
    required: 'The stock quantity field is required.',
    min: { value: 0, message: 'The stock quantity must be a positive number.' },
  },
  reorder_point: {
    required: 'The reorder point field is required.',
    min: { value: 0, message: 'The reorder point must be a positive number.' },
  },
};

export const emptyForm = {
  name: '',
  type: 'water_refill',
  volume_gallons: '',
  price: '',
  stock_quantity: 0,
  reorder_point: 0,
};