import crypto from 'crypto';

export const generateOrderId = () => {
  return `ORD-${crypto.randomInt(1000, 9999)}`;
};
