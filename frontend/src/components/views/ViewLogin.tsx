import React, { useState } from 'react';
import axios from 'axios';
import { useAppStore } from '../../store/appStore';
import { Icons } from '../Icons';

export const ViewLogin = () => {
    const { setAuth } = useAppStore();
    const [username, setUsername] = useState('ciso');
    const [password, setPassword] = useState('ciso');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState<'login' | 'reset'>('login');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const resp = await axios.post('http://localhost:8000/auth/login', { username, password });
            const { access_token, requires_password_change } = resp.data;

            if (requires_password_change) {
                // Keep token in memory, switch to reset mode
                axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                setStep('reset');
            } else {
                setAuth(access_token, false);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== newPasswordConfirm) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setError('');
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/auth/change-password', { new_password: newPassword });

            // Re-login to get updated token
            const resp = await axios.post('http://localhost:8000/auth/login', { username, password: newPassword });
            setAuth(resp.data.access_token, false);

        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08080C] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0A0A10] border border-[#1C1C2A] rounded-xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-glow"></div>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 shadow-[0_0_15px_rgba(124,58,237,0.15)]">
                        <Icons.Shield size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white m-0">GAP<span className="text-primary-glow">lizzer</span></h1>
                    <p className="text-muted-foreground text-sm font-mono mt-1 opacity-60">SECURE_AUTH_GATEWAY</p>
                </div>

                {error && (
                    <div className="bg-danger/10 border border-danger/30 text-danger text-sm p-3 rounded mb-6 text-center font-bold">
                        {error}
                    </div>
                )}

                {step === 'login' ? (
                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Username / Email</label>
                            <input
                                type="text"
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                            <input
                                type="password"
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white tracking-widest"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary h-12 mt-2 w-full text-base font-bold shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] disabled:opacity-50 transition-all">
                            {loading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordReset} className="flex flex-col gap-5">
                        <div className="bg-warning/10 border border-warning/30 p-3 rounded text-warning text-sm font-bold text-center mb-2">
                            Mandatory security policy requires you to change the default CISO password before proceeding.
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                            <input
                                type="password"
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white tracking-widest"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                className="input h-12 bg-[#050508] border-[#1C1C2A] focus:border-primary transition-colors text-white tracking-widest"
                                value={newPasswordConfirm}
                                onChange={e => setNewPasswordConfirm(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn bg-success/20 text-success border-success/50 hover:bg-success hover:text-white h-12 mt-2 w-full text-base font-bold transition-all disabled:opacity-50">
                            {loading ? 'UPDATING SECURITY PROTOCOLS...' : 'SET NEW PASSWORD'}
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-8 text-xs text-muted-foreground/40 font-mono text-center">
                Cyber GAP Research &copy; 2026<br />
                Unauthorized access is strictly prohibited.
            </div>
        </div>
    );
};
