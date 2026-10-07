import { NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
    LayoutDashboard,
    Files,
    LineChart,
    type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nProvider';
import './MainNav.css';

interface NavItem {
    label: string;
    icon: LucideIcon;
    path: string;
}

const navigation: NavItem[] = [
    { label: 'nav.dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'nav.documents', icon: Files, path: '/documents' },
    { label: 'nav.analytics', icon: LineChart, path: '/analytics' },
];

export default function MainNav() {
    const shouldReduceMotion = useReducedMotion();
    const { t } = useI18n();

    return (
        <nav className="main-nav">
            <div className="main-nav__container">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `main-nav__item ${isActive ? 'main-nav__item--active' : ''}`}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={16} strokeWidth={2} className="main-nav__icon" />
                                    <span className="main-nav__label">{t(item.label)}</span>
                                    {isActive && !shouldReduceMotion && (
                                        <motion.div
                                            layoutId="main-nav-indicator"
                                            className="main-nav__indicator"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
