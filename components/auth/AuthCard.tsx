'use client';

import Link from 'next/link';

import { ShoppingBag } from 'lucide-react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  imageSrc?: string;
}

export function AuthCard({ children, title, subtitle, imageSrc }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-fade-in">
      <div className="flex w-full max-w-5xl gap-8 lg:gap-0">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 animate-slide-up">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-muted-foreground">{subtitle}</p>
                )}
              </div>
              <Link
                href="/"
                className="rounded-full border border-accent bg-muted px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent hover:text-accent-foreground"
              >
                Go Home
              </Link>
            </div>
            {children}
          </div>
        </div>

        {/* Right side - Image/Gradient */}
        {imageSrc ? (
          <div className="hidden lg:flex w-1/2 items-center justify-center">
            <img
              src={imageSrc}
              alt="Auth illustration"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        ) : (
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-primary rounded-2xl items-center justify-center p-12">
            <div className="text-center text-primary-foreground">
              <div className="text-6xl font-bold mb-4">
              <ShoppingBag className="w-16 h-16 mx-auto" />
            </div>
              <h2 className="text-3xl font-bold mb-4">Food Market</h2>
              <p className="text-xl opacity-90">
                Order delicious food from your favorite restaurants
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
