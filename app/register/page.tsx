'use client'

import { useState } from 'react'
import { Barcode, Package, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function ProductRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const checkForKeychain = () => {
    return new Promise((resolve) => {
      if (window.hive_keychain) {
        resolve(true)
      } else {
        // Check again after a short delay to allow extension to inject
        setTimeout(() => {
          resolve(!!window.hive_keychain)
        }, 500)
      }
    })
  }

  const registerProductOnHive = async (product) => {
    try {
      // First check if Keychain is installed
      const isKeychainInstalled = await checkForKeychain()
      if (!isKeychainInstalled) {
        throw new Error('Please install Hive Keychain extension first.')
      }

      // Random memo to sign the transaction
      const memo = `Product registration - ${product.name}`

      // Request signature from Keychain
      return new Promise((resolve, reject) => {
        window.hive_keychain.requestCustomJson(
          product.username, // Hive username
          'supplychain', // Contract name
          'active', // Permission level
          JSON.stringify({
            contractName: 'supplychain',
            action: 'registerProduct',
            payload: {
              name: product.name,
              description: product.description,
              sku: product.sku,
              category: product.category,
              initialCustody: product.initialCustody,
              image: product.image // Assuming image is a file or a base64 string
            }
          }),
          memo,
          (response) => {
            if (response.success) {
              resolve({
                success: true,
                transactionId: response.result
              })
            } else {
              reject(new Error(response.message))
            }
          }
        )
      })
    } catch (error) {
      console.error('Product registration error:', error)
      throw error
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const product = {
        name: 'Sample Product',
        description: 'This is a sample product',
        sku: 'SAMPLE001',
        category: 'electronics',
        initialCustody: 'Warehouse A',
        image: 'data:image/png;base64,...' // Replace with actual image data
      }

      const transactionResult = await registerProductOnHive(product)
      toast({
        title: "Product Registered",
        description: `Transaction ID: ${transactionResult.transactionId}`,
      })
    } catch (error) {
      toast({
        title: "Product Registration Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Register New Product</CardTitle>
          <CardDescription>Enter the details of the new product to register it on the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="Enter product name" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter product description" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="Enter product SKU" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="initialCustody">Initial Custody</Label>
                <Input id="initialCustody" placeholder="Enter initial custody location" required />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="image">Product Image</Label>
                <Input id="image" type="file" accept="image/*" />
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registering...
                </div>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" /> Register Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Import Bulk Products
          </Button>
          <Button variant="outline">
            <Barcode className="mr-2 h-4 w-4" /> Generate QR Code
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}