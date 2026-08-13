export const ORDER_STATUSES = {
  queued: 'queued',
  processing: 'processing',
  transit: 'transit',
  completed: 'completed',
};

export const ORDER_TYPES = {
  walk_in: 'walk_in',
  delivery: 'delivery',
};

export const DELIVERY_STATUSES = {
  pending: 'pending',
  delivered: 'delivered',
  failed: 'failed',
};

export const STATUS_LABELS = {
  queued: 'Queued',
  processing: 'Processing',
  transit: 'Transit',
  completed: 'Completed',
};

export const STATUS_BADGE_VARIANTS = {
  queued: 'slate',
  processing: 'amber',
  transit: 'blue',
  completed: 'green',
};

export const TYPE_LABELS = {
  walk_in: 'Walk-In',
  delivery: 'Delivery',
};

export const TYPE_BADGE_VARIANTS = {
  walk_in: 'slate',
  delivery: 'violet',
};

export const DELIVERY_STATUS_BADGE_VARIANTS = {
  pending: 'slate',
  delivered: 'emerald',
  failed: 'red',
};

export const TERMINAL_STATUSES = [ORDER_STATUSES.completed];

const TRANSITIONS = {
  [ORDER_TYPES.walk_in]: {
    [ORDER_STATUSES.queued]: [ORDER_STATUSES.processing],
    [ORDER_STATUSES.processing]: [ORDER_STATUSES.completed],
    [ORDER_STATUSES.transit]: [ORDER_STATUSES.completed],
    [ORDER_STATUSES.completed]: [],
  },
  [ORDER_TYPES.delivery]: {
    [ORDER_STATUSES.queued]: [ORDER_STATUSES.processing],
    [ORDER_STATUSES.processing]: [ORDER_STATUSES.transit],
    [ORDER_STATUSES.transit]: [ORDER_STATUSES.completed],
    [ORDER_STATUSES.completed]: [],
  },
};

export function canTransition(order, toStatus) {
  const orderType = order?.order_type ?? ORDER_TYPES.walk_in;
  const allowed = TRANSITIONS[orderType]?.[order?.status];
  return Array.isArray(allowed) && allowed.includes(toStatus);
}

export function getAllowedTransitions(order) {
  const orderType = order?.order_type ?? ORDER_TYPES.walk_in;
  return [...(TRANSITIONS[orderType]?.[order?.status] ?? [])];
}

export function getNextStatus(order) {
  return getAllowedTransitions(order)[0] ?? null;
}

export function isTerminal(order) {
  return TERMINAL_STATUSES.includes(order?.status);
}