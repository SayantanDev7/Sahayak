import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking phone login logic as username/password
      await login({ username: phone, password: 'password' });
      navigate('/hub');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 px-4 font-sans text-white">
      <Card className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter" style={{ WebkitTextStroke: '1px white' }}>
            Sahayak <span className="text-[#ccff00]">Login</span>
          </h2>
          <p className="text-xl text-gray-400 mt-2">
            Apna mobile number darj karein
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-xl font-bold text-gray-300 mb-2">
                Mobile Number (Phone)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex. 9876543210"
                className="w-full px-4 py-3 text-xl bg-black/50 text-white border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#ccff00] focus:border-[#ccff00] transition-all"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full py-4 text-xl font-bold text-black bg-[#ccff00] hover:bg-[#aacc00] transition-colors"
              disabled={loading}
            >
              {loading ? 'Kripya Pratiksha Karein...' : 'OTP Bhejein / Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
