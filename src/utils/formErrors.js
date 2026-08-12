export function toFieldErrors(errors = {}) {
  return Object.entries(errors).reduce((acc, [field, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : messages;
    if (message) acc[field] = message;
    return acc;
  }, {});
}