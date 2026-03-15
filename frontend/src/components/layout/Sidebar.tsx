import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Icons } from '../Icons';

const navItems = [
    { id: 'overview', label: 'Overview', icon: <Icons.Grid /> },
    { id: 'gap_board', label: 'GAP Board', icon: <Icons.Checklist /> },
    { id: 'ai_analysis', label: 'AI Agent Pipeline', icon: <Icons.Cpu /> },
    { id: 'gamification', label: 'Gamification', icon: <Icons.Trophy /> },
    { id: 'my_gaps', label: 'My GAPs (Unit)', icon: <Icons.Shield /> },
];

export const Sidebar = () => {
    const { activeView, setActiveView } = useAppStore();

    return (
        <div className="w-64 bg-surface border-r border-[#1C1C2A] p-6 flex flex-col h-full sticky top-0 hidden md:flex">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded text-black font-black flex items-center justify-center text-xl bg-gradient-to-br from-primary to-primary-glow">Gap</div>
                <div className="font-bold text-xl tracking-wider">GapRease</div>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map(item => (
                    <div
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                    >
                        {item.icon} {item.label}
                    </div>
                ))}
            </nav>

            <div className="mt-auto border-t border-[#1C1C2A] pt-6 flex items-center gap-3">
                <div className="avatar">AS</div>
                <div>
                    <div className="text-sm font-bold">Alice Smith</div>
                    <div className="text-xs text-muted-foreground">CISO (Admin)</div>
                </div>
            </div>
        </div>
    );
};
