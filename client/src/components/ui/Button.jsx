import { Link } from 'react-router-dom';

function Button({ to, children, variant = 'primary', className = '' }) {
  const classes = ['button', `button-${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}

export default Button;
