'use client'

import { useState } from 'react'
import { Search, ChevronDown, MessageCircle } from 'lucide-react'
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is blockchain technology?",
    answer: "Blockchain is a decentralized, distributed ledger technology that records transactions across many computers so that the record cannot be altered retroactively without the alteration of all subsequent blocks and the consensus of the network."
  },
  {
    question: "How does blockchain improve supply chain management?",
    answer: "Blockchain enhances supply chain management by providing increased transparency, improved traceability, enhanced security, and streamlined processes. It allows all parties in the supply chain to access the same information, reducing disputes and increasing trust."
  },
  {
    question: "How do I track a product using this platform?",
    answer: "To track a product, navigate to the 'Tracking' page and enter the unique tracking ID associated with your product. The system will display real-time information about the product's location and status in the supply chain."
  },
  {
    question: "What should I do if I encounter an issue with the platform?",
    answer: "If you experience any issues, please first check our FAQ section for common problems and solutions. If your issue persists, you can contact our support team through the 'Contact Support' button at the bottom of this page."
  },
  {
    question: "How secure is the data on this platform?",
    answer: "Our platform utilizes advanced blockchain technology to ensure the highest level of data security and integrity. All transactions are encrypted and distributed across a network of computers, making it virtually impossible to tamper with the data."
  }
]

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>Find answers to common questions or contact our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="search">Search FAQs</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Type your question here"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">View All FAQs</Button>
          <Button>
            <MessageCircle className="mr-2 h-4 w-4" /> Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}