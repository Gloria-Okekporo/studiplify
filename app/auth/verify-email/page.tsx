import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Common/Logo';

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-sm md:p-lg lg:p-xl bg-surface-container-lowest">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-lg">
          <Logo textSize="text-3xl" iconContainerSize="w-12 h-12 rounded-xl" iconSize="text-3xl" />
        </div>

        <h2 className="font-display text-h2 mb-sm">Check your email</h2>
        
        <div className="glass-card p-lg rounded-2xl mb-lg border border-outline-variant/30">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-md">
            <span className="material-symbols-outlined text-3xl">mark_email_unread</span>
          </div>
          <p className="text-on-surface-variant font-body-md mb-md">
            We've sent a verification link to your email address. 
            Please click the link to verify your account and complete the signup process.
          </p>
          <p className="text-on-surface-variant font-body-sm text-sm opacity-80">
            If you don't see it, be sure to check your spam folder.
          </p>
        </div>

        <p className="font-body-md text-on-surface-variant">
          Back to{' '}
          <Link
            href="/auth/login"
            className="text-primary hover:text-tertiary transition-colors font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
