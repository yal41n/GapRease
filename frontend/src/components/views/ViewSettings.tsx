import React, { useState } from 'react';
import axios from 'axios';
import { Icons } from '../Icons';
import { useAppStore } from '../../store/appStore';

export const ViewSettings = () => {
    const { token } = useAppStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('intern');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !email || !password) {
            setError('Please fill in all fields (Name, Email, Password)');
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                'http://localhost:8000/users',
                { name, email, password, role },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(`User ${name} successfully created as ${role.toUpperCase()}!`);
            setName('');
            setEmail('');
            setPassword('');
            setRole('intern');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to create user. Ensure you have the right permissions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-slideIn">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white m-0">System<span className="text-primary-glow">Settings</span></h1>
                    <p className="text-muted-foreground text-sm font-mono mt-1 opacity-60">ACCESS_CONTROL_MATRIX</p>
                </div>
            </div>

            <div className="card p-6 border-[#1C1C2A] max-w-2xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary">
                        <Icons.UserPlus />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">User Management</h2>
                        <p className="text-sm text-muted-foreground">Provision new users and assign systemic roles.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/30 text-danger text-sm p-3 rounded mb-6 font-bold">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-success/10 border border-success/30 text-success text-sm p-3 rounded mb-6 font-bold">
                        {success}
                    </div>
                )}

                <form onSubmit={handleCreateUser} className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                            <input
                                type="text"
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="E.g. John Doe"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                            <input
                                type="email"
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="john@company.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Temporary Password</label>
                            <input
                                type="text"
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white tracking-widest"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="********"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">System Role</label>
                            <select
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white cursor-pointer"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="intern">Intern (Read-Only Assignee)</option>
                                <option value="manager">Manager (Department Head)</option>
                                <option value="admin">Admin (System Operations)</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary h-12 mt-4 w-full text-base font-bold shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] disabled:opacity-50 transition-all">
                        {loading ? 'PROVISIONING...' : 'PROVISION USER'}
                    </button>
                </form>
            </div>

        </div>
    );
};
