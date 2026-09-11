export function Button({ variant = 'primary', size, className = '', as: As = 'button', ...props }) {
  const classes = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', className].filter(Boolean).join(' ');
  return <As className={classes} {...props} />;
}
