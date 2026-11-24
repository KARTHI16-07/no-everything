import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LogoMonogram from './LogoMonogram';
import { Sun, Moon, Menu, X, ArrowUpRight, User as UserIcon, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Quotes', path: '/quotes' },
    { name: 'Projects', path: '/projects' },
    { name: 'Explore', path: '/explore' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const appModules = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Habits', path: '/habits' },
    { name: 'Tasks & Goals', path: '/tasks' },
    { name: 'Focus Lab', path: '/focus' },
    { name: 'Deep Journal', path: '/journal' },
    { name: 'NQT Prep', path: '/nqt' },
    { name: 'AI Mind', path: '/ai-assistant' },
    { name: 'Analytics', path: '/analytics' },
  ];

  return (
    <nav
      className={`fixed-top transition-smooth ${
        scrolled
          ? 'backdrop-blur py-3 border-bottom'
          : 'bg-transparent py-4'
      }`}
      style={{
        zIndex: 1050,
        backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
        borderColor: scrolled ? 'var(--border-color)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
      }}
    >
      <div className="container-fluid px-lg-5 px-3">
        <div className="d-flex align-items-center justify-content-between">
          {/* Custom NE Monogram Logo */}
          <Link to="/" className="d-flex align-items-center text-decoration-none">
            <LogoMonogram width={130} height={38} showWordmark={false} />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-mono text-decoration-none transition-smooth"
                style={{
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: location.pathname === link.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: location.pathname === link.path ? '1px solid var(--text-primary)' : '1px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="dropdown">
                <button
                  className="font-mono btn p-0 text-decoration-none transition-smooth dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--text-primary)',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Modules
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-dark rounded-0 border mt-2 p-2"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  {appModules.map(m => (
                    <li key={m.path}>
                      <Link
                        to={m.path}
                        className="dropdown-item font-mono py-2 px-3 transition-smooth"
                        style={{
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {m.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Action Controls: Theme Switcher & Auth */}
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleTheme}
              className="editorial-btn-ghost p-2"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
              style={{ borderRadius: '1px' }}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <div className="d-none d-sm-flex align-items-center gap-2">
                <Link to="/dashboard" className="editorial-btn editorial-btn-outline py-2 px-3">
                  <LayoutDashboard size={14} />
                  <span>DASHBOARD</span>
                </Link>
                <Link to="/profile" className="editorial-btn editorial-btn-ghost p-2" title="User Settings">
                  <UserIcon size={16} />
                </Link>
                <button onClick={logout} className="editorial-btn editorial-btn-ghost p-2" title="Log Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="editorial-btn editorial-btn-primary py-2 px-4 d-none d-sm-inline-flex">
                <span>ENTER</span>
                <ArrowUpRight size={14} />
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="d-lg-none editorial-btn-ghost p-2"
              aria-label="Open Mobile Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 vh-100 p-4"
          style={{
            backgroundColor: 'var(--bg-primary)',
            zIndex: 1100,
            overflowY: 'auto',
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <LogoMonogram width={120} height={35} />
            <button
              onClick={() => setMobileOpen(false)}
              className="editorial-btn-ghost p-2"
              aria-label="Close Mobile Menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="d-flex flex-column gap-3 mb-5">
            <span className="editorial-label">EXPLORE</span>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="font-headline fs-3 text-decoration-none py-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="d-flex flex-column gap-3 mb-5">
              <span className="editorial-label">WORKSPACE</span>
              {appModules.map(m => (
                <Link
                  key={m.path}
                  to={m.path}
                  className="font-mono text-decoration-none py-1"
                  style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  {m.name}
                </Link>
              ))}
              <div className="d-flex gap-2 mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <Link to="/profile" className="editorial-btn editorial-btn-outline w-50">Profile</Link>
                <button onClick={logout} className="editorial-btn editorial-btn-ghost w-50">Log Out</button>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
              <Link to="/auth" className="editorial-btn editorial-btn-primary w-100 py-3">
                <span>LOGIN / GET STARTED</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
