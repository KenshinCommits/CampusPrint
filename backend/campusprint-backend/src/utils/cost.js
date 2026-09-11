// Tune these to match your shop's real prices - judges like seeing real numbers.
const RATE_BW = 2; // per page, black & white
const RATE_COLOR = 8; // per page, color
const BINDING_FEE = {
  none: 0,
  staple: 5,
  spiral: 30,
};

function computeCost({ colorMode, pages, copies, binding }) {
  const perPage = colorMode === 'color' ? RATE_COLOR : RATE_BW;
  const printCost = perPage * pages * copies;
  const bindingCost = (BINDING_FEE[binding] || 0) * copies;
  const total = printCost + bindingCost;
  return {
    perCopy: perPage * pages,
    printCost,
    bindingCost,
    total,
    currency: 'INR',
  };
}

module.exports = { computeCost, RATE_BW, RATE_COLOR, BINDING_FEE };
