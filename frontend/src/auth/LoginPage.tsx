import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Receptar</h1>
        <p className="text-gray-500 text-center mb-6">Bakery Recipe Costing & Impact Analyzer</p>
        {error && <Message severity="error" text={error} className="w-full mb-4" />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <InputText type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <InputText type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full" required />
          </div>
          <Button type="submit" label="Sign in" className="w-full" />
        </form>
      </div>
    </div>
  );
}
