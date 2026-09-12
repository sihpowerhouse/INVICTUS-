import { NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
    LayoutDashboard,
    FolderKanban,
    Files,
    ShieldCheck,
    Search,
    Brain,
    Clock3,
    TriangleAlert,
    Shield,
    ScrollText,
    Settings,
    PlaySquare,
    type LucideIcon,
} from 'lucide-react';

interface NavItem {
    label: string;
    icon: LucideIcon;
    path: string;
}

interface NavGroup {
    section: string;
    items: NavItem[];
}

const navigation: NavGroup[] = [
    {
        section: 'OPERATIONS',
        items: [
            { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
            { label: 'Cases', icon: FolderKanban, path: '/cases' },
            { label: 'Documents', icon: Files, path: '/documents' },
            { label: 'Evidence', icon: ShieldCheck, path: '/evidence' },
            { label: 'Media', icon: PlaySquare, path: '/media' },
        ],
    },
    {
        section: 'INTELLIGENCE',
        items: [
            { label: 'AI Search', icon: Search, path: '/intelligence/search' },
            { label: 'Case Q&A', icon: Brain, path: '/intelligence/qa' },
            { label: 'Timeline', icon: Clock3, path: '/intelligence/timeline' },
            { label: 'Inconsistencies', icon: TriangleAlert, path: '/intelligence/inconsistencies' },
        ],
    },
    {
        section: 'SECURITY',
        items: [
            { label: 'Integrity', icon: Shield, path: '/integrity' },
            { label: 'Audit Logs', icon: ScrollText, path: '/audit' },
        ],
    },
];

function Sidebar() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-mark">I</div>

                <div>
                    <div className="brand-name">INVICTUS</div>
                    <div className="brand-subtitle">EVIDENCE INTELLIGENCE</div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navigation.map((group) => (
                    <div className="nav-group" key={group.section}>
                        <div className="nav-section-title">
                            {group.section}
                        </div>

                        {group.items.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    className={({ isActive }) =>
                                        `nav-item${isActive ? ' active' : ''}`
                                    }
                                    key={item.label}
                                    to={item.path}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && !shouldReduceMotion && (
                                                <motion.div 
                                                    layoutId="sidebar-active-indicator"
                                                    className="nav-item-active-bg"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                            <Icon size={18} strokeWidth={1.8} style={{ position: 'relative', zIndex: 1 }} />
                                            <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <NavLink
                    className={({ isActive }) =>
                        `nav-item${isActive ? ' active' : ''}`
                    }
                    to="/settings"
                >
                    {({ isActive }) => (
                        <>
                            {isActive && !shouldReduceMotion && (
                                <motion.div 
                                    layoutId="sidebar-active-indicator"
                                    className="nav-item-active-bg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            <Settings size={18} strokeWidth={1.8} style={{ position: 'relative', zIndex: 1 }} />
                            <span style={{ position: 'relative', zIndex: 1 }}>Settings</span>
                        </>
                    )}
                </NavLink>

                <div className="security-status">
                    <div className="status-dot" />
                    <div>
                        <div className="status-title">SYSTEM SECURE</div>
                        <div className="status-text">All systems operational</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
