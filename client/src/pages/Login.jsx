import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMusicNote, HiEye, HiEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎵');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-wave-accent to-wave-pink flex items-center justify-center accent-glow">
            <HiMusicNote className="text-white" size={24} />
          </div>
          <span className="font-display font-bold text-3xl gradient-text">WaveTune</span>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="font-display font-bold text-2xl mb-1 text-center">Welcome back</h2>
          <p className="text-wave-muted text-sm text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-wave-muted mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-wave-surface border border-wave-border text-wave-text placeholder-wave-muted focus:outline-none focus:border-wave-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-wave-muted mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-wave-surface border border-wave-border text-wave-text placeholder-wave-muted focus:outline-none focus:border-wave-accent transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-wave-muted hover:text-wave-text">
                  {showPass ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-wave-accent hover:bg-wave-accent/80 text-white font-medium transition-all accent-glow disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-wave-muted text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-wave-accent hover:underline">Sign up</Link>
          </p>
        </div>

        <p className="text-center text-wave-muted/50 text-xs mt-6">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  );
};

export default Login;
