let counter = Math.floor(Math.random() * 900) + 100; // demo-friendly starting point

/**
 * Short, human-readable order token like "CP-1042".
 * Good enough for a hackathon demo; for real concurrency safety in
 * production you'd generate this atomically in the DB layer instead.
 */
export function nextOrderToken() {
  counter += 1;
  return `CP-${1000 + counter}`;
}
