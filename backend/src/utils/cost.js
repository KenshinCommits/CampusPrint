import { config } from '../config.js';

/**
 * Pure function so it's trivial to unit-test / tune.
 * options: { pages, copies, colorMode, binding }
 */
export function calculateCost(options) {
  const pages = Math.max(1, Number(options.pages) || 1);
  const copies = Math.max(1, Number(options.copies) || 1);
  const colorMode = options.colorMode === 'color' ? 'color' : 'bw';
  const binding = ['none', 'staple', 'spiral'].includes(options.binding) ? options.binding : 'none';

  const perPage = colorMode === 'color' ? config.rates.color : config.rates.bw;
  const printCost = round2(perPage * pages * copies);

  const bindingFeePerCopy =
    binding === 'staple' ? config.rates.bindingStaple : binding === 'spiral' ? config.rates.bindingSpiral : 0;
  const bindingCost = round2(bindingFeePerCopy * copies);

  const total = round2(printCost + bindingCost);

  return {
    perPage,
    pages,
    copies,
    printCost,
    bindingCost,
    total,
    currency: 'INR',
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
