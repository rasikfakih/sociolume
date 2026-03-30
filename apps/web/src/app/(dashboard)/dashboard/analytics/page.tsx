import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@sociolume/ui';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Analytics</h1>
        <p className="text-base-content/60">Track your social media performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Advanced analytics feature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg text-base-content/70 text-center max-w-md">
              We&apos;re working on powerful analytics to help you understand your audience better.
            </p>
            <button className="btn btn-primary mt-6">Notify Me When Available</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
