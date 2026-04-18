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
    <div className="flex justify-center items-center py-12 px-4">
      <Card className="w-full max-w-md shadow-lg border-2" style={{ borderColor: '#FF9933' }}>
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold" style={{ color: '#000080' }}>
            Sahayak Login
          </h2>
          <p className="text-xl text-gray-700 mt-2">
            Apna mobile number darj karein
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-xl font-medium text-gray-800 mb-2">
                Mobile Number (Phone)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex. 9876543210"
                className="w-full px-4 py-3 text-xl border-2 rounded-lg focus:outline-none focus:ring-4 transition-all"
                style={{ borderColor: '#FF9933', focusRingColor: '#FF9933' }}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full py-4 text-xl font-bold text-white transition-opacity"
              style={{ backgroundColor: '#138808' }}
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
