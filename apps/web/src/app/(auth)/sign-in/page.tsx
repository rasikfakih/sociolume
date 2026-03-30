import { SignIn } from '@clerk/nextjs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Sociolume',
  description: 'Sign in to your Sociolume account',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-base-100 to-accent-50/30" />
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, rgba(37, 99, 235, 0.06) 0%, transparent 50%),
                         radial-gradient(circle at 70% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 40%)`
      }} />
      
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="text-center mb-8">
          <a href="/" className="inline-block text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
            Sociolume
          </a>
          <p className="mt-4 text-base-content/60">Sign in to your account</p>
        </div>
        
        <div className="bg-base-100/80 backdrop-blur-xl rounded-3xl shadow-soft-xl border border-base-200/50 p-8">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full flex flex-col items-center',
                card: 'w-full shadow-none bg-transparent',
                formButtonPrimary: 'bg-brand-600 hover:bg-brand-700 rounded-xl',
                formFieldInput: 'rounded-xl border-base-300',
                formFieldLabel: 'text-base-content/70',
                footerActionLink: 'text-brand-600 hover:text-brand-700',
              },
            }}
            routing="path"
            signUpUrl="/sign-up"
            redirectUrl="/dashboard"
          />
        </div>
        
        <p className="text-center text-sm text-base-content/50 mt-6">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-brand-600 hover:text-brand-700 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
