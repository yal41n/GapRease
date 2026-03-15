export const GAPS = [
    { id: 'GAP-001', title: 'MFA not enforced for all admins', domain: 'Access Control', status: 'open', severity: 'critical', assignedTo: 'Alice Chen', createdAt: '2026-03-10', description: 'Privileged accounts missing MFA requirements.' },
    { id: 'GAP-002', title: 'Outdated firmware on external routers', domain: 'Network Security', status: 'in_progress', severity: 'high', assignedTo: 'Bob Smith', createdAt: '2026-03-12', description: 'Edge routers running vulnerable firmware v2.1.' },
    { id: 'GAP-003', title: 'Unencrypted backups in S3', domain: 'Data Protection', status: 'open', severity: 'critical', assignedTo: 'Unassigned', createdAt: '2026-03-14', description: 'Database weekly backups stored as plaintext.' },
    { id: 'GAP-004', title: 'Missing EDR on contractor laptops', domain: 'Endpoint Security', status: 'resolved', severity: 'medium', assignedTo: 'Alice Chen', createdAt: '2026-03-01', description: 'Contractors using non-compliant devices.' },
    { id: 'GAP-005', title: 'No formal incident response plan', domain: 'Incident Response', status: 'open', severity: 'high', assignedTo: 'CISO', createdAt: '2026-02-28', description: 'IR plan missing ransomware playbook.' },
    { id: 'GAP-006', title: 'Unauthorized shadow IT SaaS', domain: 'Asset Management', status: 'in_progress', severity: 'medium', assignedTo: 'Bob Smith', createdAt: '2026-03-11', description: 'Marketing team using unapproved analytics tool.' },
    { id: 'GAP-007', title: 'Excessive permissions on guest Wi-Fi', domain: 'Network Security', status: 'resolved', severity: 'low', assignedTo: 'Unassigned', createdAt: '2026-03-05', description: 'Guest network can ping internal subnets.' },
    { id: 'GAP-008', title: 'Stale SSH keys in GitHub', domain: 'Access Control', status: 'open', severity: 'high', assignedTo: 'Alice Chen', createdAt: '2026-03-15', description: 'Former employee keys still active.' }
];

export const USERS = [
    { id: 'u1', name: 'Alex CISO', role: 'ciso', initials: 'AC', resolvedCount: 42, assignedCount: 8, points: 4200 },
    { id: 'u2', name: 'Alice Chen', role: 'user', initials: 'AC', resolvedCount: 15, assignedCount: 3, points: 1500 },
    { id: 'u3', name: 'Bob Smith', role: 'user', initials: 'BS', resolvedCount: 9, assignedCount: 2, points: 900 },
    { id: 'u4', name: 'Charlie Dev', role: 'user', initials: 'CD', resolvedCount: 24, assignedCount: 1, points: 2400 }
];

export const LEADERBOARD = [...USERS].sort((a, b) => b.resolvedCount - a.resolvedCount);

export const COMMUNITY_INTEL = [
    { id: 'ci1', domain: 'Access Control', snippet: 'Implement JIT provisioning for cloud admins to reduce standing privileges.', contributor: 'Anonymous · FinTech' },
    { id: 'ci2', domain: 'Data Protection', snippet: 'Rotate AWS KMS keys every 90 days; enforce via SCP.', contributor: 'Anonymous · Healthcare' },
    { id: 'ci3', domain: 'Endpoint Security', snippet: 'Quarantine devices failing posture check before VPN connect.', contributor: 'Anonymous · Retail' }
];
