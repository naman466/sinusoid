import Link from 'next/link'
import { ArrowRight, Shield, RefreshCw, Lock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Homepage() {
  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to SupplyChainX</h1>
        <p className="text-xl text-gray-600 mb-8">Revolutionizing supply chain management with blockchain technology</p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/login">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/learn-more">Learn More</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Transparency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Gain full visibility into your supply chain with immutable blockchain records.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="mr-2 h-5 w-5 text-primary" />
              Traceability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Track products from origin to destination with real-time updates and detailed history.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-primary" />
              Trust
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Build confidence with partners and customers through secure, verifiable data.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">How Blockchain Benefits Supply Chain</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Immutable record-keeping ensures data integrity</li>
          <li>Smart contracts automate and secure transactions</li>
          <li>Decentralized network increases resilience and reduces single points of failure</li>
          <li>Enhanced traceability improves recall efficiency and reduces fraud</li>
        </ul>
      </section>
    </div>
  )
}