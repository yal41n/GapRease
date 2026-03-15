import React from 'react';

const THEME = {
    primaryGlow: 'var(--primary-glow)',
    textMuted: 'var(--text-muted)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
};

export const getSeverityColor = (sev: string) => {
    if (sev === 'critical') return { bg: 'rgba(239, 68, 68, 0.2)', color: THEME.danger };
    if (sev === 'high') return { bg: 'rgba(245, 158, 11, 0.2)', color: THEME.warning };
    if (sev === 'medium') return { bg: 'rgba(124, 58, 237, 0.2)', color: THEME.primaryGlow };
    return { bg: 'rgba(139, 139, 173, 0.2)', color: THEME.textMuted };
};

export const getStatusColor = (status: string) => {
    if (status === 'open') return { bg: 'rgba(239, 68, 68, 0.1)', color: THEME.danger };
    if (status === 'in_progress') return { bg: 'rgba(124, 58, 237, 0.1)', color: THEME.primaryGlow };
    return { bg: 'rgba(16, 185, 129, 0.1)', color: THEME.success };
};

export const Badge = ({ text, colorOpts }: { text: string, colorOpts: { bg: string, color: string } }) => (
    <span className="badge" style={{ backgroundColor: colorOpts.bg, color: colorOpts.color }}>
        {text.replace('_', ' ')}
    </span>
);
