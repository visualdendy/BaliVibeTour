'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign In"}
        </Button>
    )
}

export default function AdminLoginPage() {
    const [state, formAction] = useActionState(login, null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        {state?.error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center font-medium animate-in fade-in">
                                {state.error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" type="text" required placeholder="admin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required placeholder="••••••••" />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
