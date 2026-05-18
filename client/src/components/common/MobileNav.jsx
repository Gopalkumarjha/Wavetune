import { NavLink } from 'react-router-dom';
import { HiHome, HiSearch, HiCollection, HiHeart } from 'react-icons/hi';

const MobileNav = () => {
  const items = [
    { to: '/', icon: <HiHome size={22} />, label: 'Home' },
    { to: '/search', icon: <HiSearch size={22} />, label: 'Search' },
    { to: '/library', icon: <HiCollection size={22} />, label: 'Library' },
    { to: '/liked', icon: <HiHeart size={22} />, label: 'Liked' }
  ];
  return (
    <nav className="md:hidden fixed bottom-20 left-0 right-0 glass-dark border-t border-wave-border z-40 flex">
      {items.map(item => (
        <NavLink key={item.to} to={item.to} end={item.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-all ${isActive ? 'text-wave-accent' : 'text-wave-muted'}`}>
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};
export default MobileNav;
