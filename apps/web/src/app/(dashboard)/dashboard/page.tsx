import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@sociolume/ui';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Welcome back!</h1>
          <p className="text-base-content/60 mt-1">Here&apos;s an overview of your account</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="soft" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </Button>
          <Button size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Report
          </Button>
        </div>
      </div>

      {/* Stats Cards - Bento Grid Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="soft" className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content/60 font-medium">API Calls</p>
                <p className="text-3xl font-bold text-base-content mt-2">1,234</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-success-100 text-success-700 text-xs font-medium">
                    +12%
                  </span>
                  <span className="text-xs text-base-content/50">from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-600" />
          </CardContent>
        </Card>

        <Card variant="soft" className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content/60 font-medium">Storage Used</p>
                <p className="text-3xl font-bold text-base-content mt-2">2.4 GB</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-warning-100 text-warning-700 text-xs font-medium">
                    70%
                  </span>
                  <span className="text-xs text-base-content/50">of 5 GB limit</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-accent-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="soft" className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content/60 font-medium">Team Members</p>
                <p className="text-3xl font-bold text-base-content mt-2">5</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-success-100 text-success-700 text-xs font-medium">
                    +2
                  </span>
                  <span className="text-xs text-base-content/50">this month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="soft" className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content/60 font-medium">Active Alerts</p>
                <p className="text-3xl font-bold text-base-content mt-2">3</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-100 text-error-700 text-xs font-medium">
                    Attention
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-error-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription */}
        <Card variant="outline" className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <CardTitle>Your Plan</CardTitle>
              <Badge variant="success">Active</Badge>
            </div>
            <CardDescription className="mb-6">Current subscription details</CardDescription>
            
            <div className="p-4 rounded-xl bg-base-200/50 border border-base-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-base-content">Professional</p>
                  <p className="text-sm text-base-content/60">$79/month • Renews Apr 15, 2026</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-base-content/70">API Calls</span>
                  <span className="text-base-content font-medium">1,234 / 10,000</span>
                </div>
                <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-base-content/70">Storage</span>
                  <span className="text-base-content font-medium">2.4 GB / 5 GB</span>
                </div>
                <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-500 rounded-full" style={{ width: '48%' }} />
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6 rounded-xl">
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card variant="outline" className="rounded-2xl">
          <CardContent className="p-6">
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription className="mb-6">Latest alerts and updates</CardDescription>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-error-50/50 border border-error-100">
                <div className="w-10 h-10 rounded-xl bg-error-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-content">API rate limit warning</p>
                  <p className="text-xs text-base-content/60 mt-1">
                    You&apos;ve used 90% of your monthly API calls
                  </p>
                  <p className="text-xs text-base-content/40 mt-2">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-success-50/50 border border-success-100">
                <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-content">New team member</p>
                  <p className="text-xs text-base-content/60 mt-1">john@example.com joined your team</p>
                  <p className="text-xs text-base-content/40 mt-2">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-brand-50/50 border border-brand-100">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-content">System update</p>
                  <p className="text-xs text-base-content/60 mt-1">New features available in v2.0</p>
                  <p className="text-xs text-base-content/40 mt-2">3 days ago</p>
                </div>
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-4 rounded-xl">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card variant="soft" className="rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and events</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-base-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-base-content/60">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-base-content/60">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-base-content/60">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-base-100 hover:bg-base-50/50">
                  <td className="py-4 px-4">
                    <Badge variant="info">API</Badge>
                  </td>
                  <td className="py-4 px-4 text-base-content">POST /api/v1/analytics</td>
                  <td className="py-4 px-4 text-base-content/60 text-sm">Today, 2:30 PM</td>
                </tr>
                <tr className="border-b border-base-100 hover:bg-base-50/50">
                  <td className="py-4 px-4">
                    <Badge variant="success">Login</Badge>
                  </td>
                  <td className="py-4 px-4 text-base-content">Signed in from Chrome</td>
                  <td className="py-4 px-4 text-base-content/60 text-sm">Today, 9:15 AM</td>
                </tr>
                <tr className="border-b border-base-100 hover:bg-base-50/50">
                  <td className="py-4 px-4">
                    <Badge variant="warning">Settings</Badge>
                  </td>
                  <td className="py-4 px-4 text-base-content">Updated notification preferences</td>
                  <td className="py-4 px-4 text-base-content/60 text-sm">Yesterday</td>
                </tr>
                <tr className="border-b border-base-100 hover:bg-base-50/50">
                  <td className="py-4 px-4">
                    <Badge variant="neutral">Team</Badge>
                  </td>
                  <td className="py-4 px-4 text-base-content">Invited john@example.com</td>
                  <td className="py-4 px-4 text-base-content/60 text-sm">Mar 25, 2026</td>
                </tr>
                <tr className="hover:bg-base-50/50">
                  <td className="py-4 px-4">
                    <Badge variant="info">API</Badge>
                  </td>
                  <td className="py-4 px-4 text-base-content">GET /api/v1/users</td>
                  <td className="py-4 px-4 text-base-content/60 text-sm">Mar 24, 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
