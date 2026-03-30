import Link from 'next/link';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@sociolume/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-xl border-b border-base-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Sociolume
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-base-content/70 hover:text-base-content transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-base-content/70 hover:text-base-content transition-colors">
                Pricing
              </Link>
              <Link href="#blog" className="text-sm text-base-content/70 hover:text-base-content transition-colors">
                Blog
              </Link>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/sign-in" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                Sign In
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
              {/* Mobile Menu Dropdown */}
              <div className="dropdown dropdown-end md:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Open Menu">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100/95 backdrop-blur-xl rounded-box w-52 border border-base-200">
                  <li><Link href="#features">Features</Link></li>
                  <li><Link href="#pricing">Pricing</Link></li>
                  <li><Link href="#blog">Blog</Link></li>
                  <div className="divider my-1"></div>
                  <li><Link href="/sign-in" className="text-brand-600 font-medium">Sign In</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-base-100 to-accent-50/30" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.06) 0%, transparent 40%)`
        }} />
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-8">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-brand-700 font-medium">Now with AI-powered insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-base-content mb-6 leading-tight">
              Master Your Social Media{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                Volume
              </span>
            </h1>
            <p className="text-xl text-base-content/70 mb-10 max-w-2xl mx-auto leading-relaxed">
              Sociolume helps you analyze, track, and optimize your social media presence with 
              powerful analytics and real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full px-4 sm:px-0">
              <Link href="/sign-up" className="w-full sm:w-auto text-center">
                <Button size="lg" className="w-full sm:w-auto">Start Free Trial</Button>
              </Link>
              <Link href="#demo" className="w-full sm:w-auto text-center">
                <Button size="lg" variant="soft" className="w-full sm:w-auto">See Demo</Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-base-content/50">
              No credit card required • 14-day free trial
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="rounded-3xl overflow-hidden shadow-soft-xl border border-base-200 bg-base-100">
              <div className="bg-base-200/50 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <div className="p-6 grid grid-cols-4 gap-4">
                <div className="col-span-1 space-y-4">
                  <div className="h-8 rounded-xl bg-base-200/60" />
                  <div className="h-4 rounded-lg bg-base-200/40 w-3/4" />
                  <div className="h-4 rounded-lg bg-base-200/40 w-1/2" />
                  <div className="h-4 rounded-lg bg-base-200/40 w-2/3" />
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-4">
                  <div className="h-24 rounded-2xl bg-brand-100/50 border border-brand-200/50" />
                  <div className="h-24 rounded-2xl bg-accent-50/50 border border-accent-200/50" />
                  <div className="h-24 rounded-2xl bg-success-50/50 border border-success-200/50" />
                  <div className="col-span-3 h-32 rounded-2xl bg-base-200/30 border border-base-200/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section id="features" className="py-24 bg-base-200/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">Powerful Features</h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Everything you need to grow your social media presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="soft" className="md:col-span-1">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle>Analytics</CardTitle>
                <p className="text-base-content/60 mt-2 mb-4">
                  Comprehensive analytics dashboard with real-time insights
                </p>
                <ul className="space-y-2 text-sm text-base-content/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Track engagement
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Monitor growth
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Export reports
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="soft" className="md:col-span-1">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-accent-100 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <CardTitle>Notifications</CardTitle>
                <p className="text-base-content/60 mt-2 mb-4">
                  Stay informed with real-time notifications
                </p>
                <ul className="space-y-2 text-sm text-base-content/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Live alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Custom thresholds
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Multi-channel delivery
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card variant="soft" className="md:col-span-1">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-success-100 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle>Automation</CardTitle>
                <p className="text-base-content/60 mt-2 mb-4">
                  Automate your workflow with smart rules
                </p>
                <ul className="space-y-2 text-sm text-base-content/70">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Auto-responses
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Scheduled posts
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    AI suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-base-content mb-4">Simple Pricing</h2>
            <p className="text-lg text-base-content/60">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card variant="outline" className="rounded-3xl">
              <CardContent className="p-8">
                <CardTitle className="text-xl">Starter</CardTitle>
                <p className="text-base-content/60 text-sm mt-2">For individuals just starting out</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-base-content/60">/mo</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Up to 3 social accounts
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Basic analytics
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    1,000 API calls/month
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Email support
                  </li>
                </ul>
                <Link href="/sign-up?plan=starter" className="btn btn-outline w-full mt-8 rounded-xl">
                  Get Started
                </Link>
              </CardContent>
            </Card>

            <Card variant="soft" className="rounded-3xl border-2 border-brand-200 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium">
                  Popular
                </span>
              </div>
              <CardContent className="p-8">
                <CardTitle className="text-xl">Professional</CardTitle>
                <p className="text-base-content/60 text-sm mt-2">For growing businesses</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold">$79</span>
                  <span className="text-base-content/60">/mo</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Up to 10 social accounts
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    10,000 API calls/month
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Priority support
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Team collaboration
                  </li>
                </ul>
                <Link href="/sign-up?plan=professional" className="btn w-full mt-8 rounded-xl">
                  Get Started
                </Link>
              </CardContent>
            </Card>

            <Card variant="outline" className="rounded-3xl">
              <CardContent className="p-8">
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <p className="text-base-content/60 text-sm mt-2">For large organizations</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-base-content/60">/mo</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Unlimited accounts
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Custom analytics
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Unlimited API calls
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    24/7 support
                  </li>
                  <li className="flex items-center gap-2 text-base-content/70">
                    <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Dedicated account manager
                  </li>
                </ul>
                <Link href="/contact?plan=enterprise" className="btn btn-outline w-full mt-8 rounded-xl">
                  Contact Sales
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-brand-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Sociolume
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="soft" className="bg-white text-brand-700 hover:bg-brand-50">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-base-200/50 border-t border-base-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <span className="text-lg font-bold text-base-content">Sociolume</span>
              <p className="mt-4 text-sm text-base-content/60">
                Master your social media presence with powerful analytics.
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-base-content">Product</span>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Features</a></li>
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Pricing</a></li>
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Integrations</a></li>
              </ul>
            </div>
            <div>
              <span className="text-sm font-semibold text-base-content">Resources</span>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Documentation</a></li>
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">API Reference</a></li>
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Status</a></li>
              </ul>
            </div>
            <div>
              <span className="text-sm font-semibold text-base-content">Legal</span>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Privacy</a></li>
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Terms</a></li>
                <li><a href="#" className="text-sm text-base-content/60 hover:text-base-content">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-base-200">
            <p className="text-sm text-base-content/50">
              &copy; {new Date().getFullYear()} Sociolume. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
