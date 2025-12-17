import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default async function ThankYouPage(props: { searchParams: Promise<{ id?: string }> }) {
    const searchParams = await props.searchParams
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">Booking Received!</h1>
                <p className="text-gray-600">
                    Thank you for your request. {searchParams.id && <span className="block text-xs text-gray-400 mt-1">Ref: {searchParams.id}</span>}
                </p>

                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 text-left">
                    <p className="font-semibold mb-2">Next Steps:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Our team will assign a driver shortly.</li>
                        <li>You will receive a confirmation via WhatsApp.</li>
                        <li>Payment can be made directly to the driver.</li>
                    </ul>
                </div>

                <div className="pt-4">
                    <Button asChild className="w-full">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
