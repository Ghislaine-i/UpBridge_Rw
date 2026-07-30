import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import InputField from '../components/InputField';
import Button from '../components/Button';

// NOTE: UI only, per project spec. No backend endpoint is wired up yet.
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-3">
            <KeyRound className="text-white h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Reset your password</h1>
          <p className="text-sm text-slate-500 mt-1 text-center">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="card p-8">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <CheckCircle2 className="h-10 w-10 text-accent" />
              <p className="text-slate-700 font-medium">Check your inbox</p>
              <p className="text-sm text-slate-500">
                If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <InputField
                label="Email address"
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" fullWidth loading={loading}>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
