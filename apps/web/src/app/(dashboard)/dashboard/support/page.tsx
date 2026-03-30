import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Textarea,
} from '@sociolume/ui';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Support</h1>
        <p className="text-base-content/60">Get help with your account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Submit a support request</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input label="Subject" placeholder="How can we help?" />
              <Textarea label="Message" placeholder="Describe your issue..." rows={5} />
              <Button type="button">Submit Request</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Help Resources</CardTitle>
            <CardDescription>Find answers quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
              >
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-medium">Documentation</p>
                  <p className="text-sm text-base-content/60">Learn how to use Sociolume</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-medium">Community Forum</p>
                  <p className="text-sm text-base-content/60">Connect with other users</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
              >
                <span className="text-2xl">🎬</span>
                <div>
                  <p className="font-medium">Video Tutorials</p>
                  <p className="text-sm text-base-content/60">Watch how-to videos</p>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
              >
                <span className="text-2xl">🔧</span>
                <div>
                  <p className="font-medium">API Reference</p>
                  <p className="text-sm text-base-content/60">Developer documentation</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
