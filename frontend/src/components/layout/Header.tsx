import React from 'react';
import { Icons } from '../Icons';

export const Header = () => {
    return (
        <header className="h-16 border-b border-[#1C1C2A] bg-surface flex items-center justify-between px-6 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-4 w-96">
                <Icons.Search className="text-muted-foreground" />
                <input type="text" placeholder="Search GAPs, users, policies..." className="bg-transparent border-none outline-none text-sm w-full text-foreground" />
            </div>
            <div className="flex items-center gap-4">
                <button className="btn border-none p-2 relative">
                    <Icons.Bell />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                </button>
                <button className="btn btn-primary py-1">Export Report</button>
            </div>
        </header>
    );
};
