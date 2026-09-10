import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { UserRole } from '../types';
import { KavachLogo } from '../components/common/KavachLogo';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Radio
} from 'lucide-react';

export const Login: React.FC = () => {
  const { t } = useLanguage();
  const { login, resetPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('operator@kavach.gov.in');
  const [password, setPassword] = useState('kavach2026');
  const [error, setError] = useState<string | null>(null);

  // Forgot Password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please enter a valid official email address');
      return;
    }
    const success = await login(email);
    if (success) {
      navigate('/');
    }
  };

  const handleQuickDemoLogin = async (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    const success = await login(demoEmail, role);
    if (success) {
      navigate('/');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    await resetPassword(forgotEmail);
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModalOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Grid Lines & Ambient Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0f172a]/95 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-left">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <KavachLogo size={64} showWordmark={false} />
          </div>
          <h1 className="text-2xl font-black font-display tracking-wider text-white">
            KAVACH
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            AI-Powered Mine Subsidence Monitoring & Early Warning System
          </p>
          <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-[10px] text-cyan-300 font-mono-tech">
            Mine Safety Control Room
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Official Gov / Mine Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@kavach.gov.in"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-tech"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Security Password
              </label>
              <button
                type="button"
                id="forgot-password-btn"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-900/40 disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In to Control Room'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts Selection */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Role Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              id="demo-login-operator"
              type="button"
              onClick={() => handleQuickDemoLogin('Mine Operator', 'operator@kavach.gov.in')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-200 text-center hover:border-cyan-500/60 transition-colors"
            >
              <div className="font-bold text-cyan-400">Operator</div>
              <div className="text-[9px] text-slate-400">Control Room</div>
            </button>

            <button
              id="demo-login-safety"
              type="button"
              onClick={() => handleQuickDemoLogin('Mine Safety Officer', 'safety@kavach.gov.in')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-200 text-center hover:border-cyan-500/60 transition-colors"
            >
              <div className="font-bold text-blue-400">Safety Officer</div>
              <div className="text-[9px] text-slate-400">Geotechnical</div>
            </button>

            <button
              id="demo-login-admin"
              type="button"
              onClick={() => handleQuickDemoLogin('Admin', 'admin@kavach.gov.in')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-200 text-center hover:border-cyan-500/60 transition-colors"
            >
              <div className="font-bold text-emerald-400">Admin</div>
              <div className="text-[9px] text-slate-400">DGMS Director</div>
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-sm p-6 text-left shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Reset Control Room Password
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered official email to receive a temporary recovery token.
            </p>

            {forgotSuccess ? (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Recovery link sent to your email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@kavach.gov.in"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
