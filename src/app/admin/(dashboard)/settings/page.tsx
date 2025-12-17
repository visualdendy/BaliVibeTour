import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Agency Profile</CardTitle>
                        <CardDescription>Update your agency details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Agency Name</Label>
                            <Input defaultValue="BaliVibe Tours" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Contact Email</Label>
                            <Input defaultValue="booking@balivibe.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label>WhatsApp Number</Label>
                            <Input defaultValue="+62 812 3456 7890" />
                        </div>
                        <Button>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Telegram Bot Configuration</CardTitle>
                        <CardDescription>Manage your bot settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Bot Token</Label>
                            <Input type="password" value="********************************" disabled />
                            <p className="text-xs text-muted-foreground">Managed in environment variables.</p>
                        </div>
                        <div className="grid gap-2">
                            <Label>Group Chat ID</Label>
                            <Input placeholder="-100xxxxxxxx" />
                        </div>
                        <Button variant="secondary">Update Config</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
