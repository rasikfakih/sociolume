import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@sociolume/ui';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Admin Dashboard</h1>
        <p className="text-base-content/60">Manage your Sociolume platform</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Users</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary">👥</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-base-content/60">
              <span className="text-success">+12%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Active Subscriptions</p>
                <p className="text-2xl font-bold">856</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-success">✓</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-base-content/60">
              <span className="text-success">+8%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Monthly Revenue</p>
                <p className="text-2xl font-bold">$67,840</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-secondary">💰</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-base-content/60">
              <span className="text-success">+15%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Open Tickets</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                <span className="text-warning">🎫</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-base-content/60">
              <span className="text-error">+5</span> from yesterday
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="btn btn-outline">Manage Users</button>
              <button className="btn btn-outline">View Reports</button>
              <button className="btn btn-outline">System Status</button>
              <button className="btn btn-outline">API Logs</button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-base-200 rounded">
                <span className="text-sm">New user signup</span>
                <Badge variant="success">john@email.com</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-base-200 rounded">
                <span className="text-sm">Subscription upgrade</span>
                <Badge variant="info">Pro Plan</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-base-200 rounded">
                <span className="text-sm">Support ticket</span>
                <Badge variant="warning">Open</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage subscriptions and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-4xl mb-2">💳</span>
              <p className="text-sm text-center text-base-content/60">Coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>CMS and content management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-4xl mb-2">📝</span>
              <p className="text-sm text-center text-base-content/60">Coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Platform-wide analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <span className="text-4xl mb-2">📊</span>
              <p className="text-sm text-center text-base-content/60">Coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
