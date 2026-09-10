import { NavLink } from 'react-router-dom';
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
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span>{item.label}</span>
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
                    <Settings size={18} strokeWidth={1.8} />
                    <span>Settings</span>
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
