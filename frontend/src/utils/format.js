export function formatCurrency(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function minutesUntil(iso) {
  if (!iso) return null;
  const diffMs = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.round(diffMs / 60000));
}

export const COLOR_LABEL = { bw: 'B&W', color: 'Color' };
export const SIDED_LABEL = { single: 'Single-sided', double: 'Double-sided' };
export const BINDING_LABEL = { none: 'No binding', staple: 'Stapled', spiral: 'Spiral bound' };

export function optionsSummary(options) {
  return `${COLOR_LABEL[options.colorMode]} · ${SIDED_LABEL[options.sided]} · ${options.paperSize} · ${BINDING_LABEL[options.binding]}`;
}
