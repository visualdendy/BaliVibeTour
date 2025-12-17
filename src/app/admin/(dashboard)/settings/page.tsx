'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

export default function AdminSettingsPage() {
    const [showSuccess, setShowSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // Agency Profile State
    const [agencyName, setAgencyName] = useState("BaliVibe Tours")
    const [contactEmail, setContactEmail] = useState("booking@balivibe.com")
    const [whatsappNumber, setWhatsappNumber] = useState("+62 8990345431")

    // Telegram Config State
    const [groupChatId, setGroupChatId] = useState("-1003638463325")

    const handleSaveProfile = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setSuccessMessage("Agency Profile Saved Successfully!")
        setShowSuccess(true)
        setLoading(false)

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000)
    }

    const handleUpdateConfig = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))

        setSuccessMessage("Telegram Configuration Updated!")
        setShowSuccess(true)
        setLoading(false)

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000)
    }

    return (
        <>
            {/* Success Popup with Animation */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full mx-4 animate-in zoom-in slide-in-from-bottom-4 duration-300">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                            <p className="text-lg text-gray-600">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

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
                                <Input
                                    value={agencyName}
                                    onChange={(e) => setAgencyName(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Contact Email</Label>
                                <Input
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>WhatsApp Number</Label>
                                <Input
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                />
                            </div>
                            <Button
                                onClick={handleSaveProfile}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
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
                                <Input
                                    placeholder="-100xxxxxxxx"
                                    value={groupChatId}
                                    onChange={(e) => setGroupChatId(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="secondary"
                                onClick={handleUpdateConfig}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Config"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
