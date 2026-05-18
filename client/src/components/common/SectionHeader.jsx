import { Link } from 'react-router-dom';
const SectionHeader = ({ title, link, linkText = 'See all' }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="font-display font-bold text-xl text-wave-text">{title}</h2>
    {link && (
      <Link to={link} className="text-xs text-wave-muted hover:text-wave-accent transition-colors font-medium uppercase tracking-wider">
        {linkText}
      </Link>
    )}
  </div>
);
export default SectionHeader;
