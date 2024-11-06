'use client'

import { useState } from 'react'
import { User, Mail, Lock, Bell, Eye, EyeOff, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ProfileSettings() {
  const [showPassword, setShowPassword] = useState(false)
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

  const updateProfileOnHive = async (profileData) => {
    try {
      // First check if Keychain is installed
      const isKeychainInstalled = await checkForKeychain()
      if (!isKeychainInstalled) {
        throw new Error('Please install Hive Keychain extension first.')
      }

      // Random memo to sign the transaction
      const memo = `Profile update - ${profileData.name}`

      // Request signature from Keychain
      return new Promise((resolve, reject) => {
        window.hive_keychain.requestCustomJson(
          'your-hive-username', // Replace with your Hive username
          'supplychain', // Contract name
          'active', // Permission level
          JSON.stringify({
            contractName: 'supplychain',
            action: 'updateProfile',
            payload: {
              name: profileData.name,
              email: profileData.email,
              role: profileData.role,
              password: profileData.password
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
      console.error('Profile update error:', error)
      throw error
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const profileData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'consumer',
        password: 'newpassword'
      }

      const updateResult = await updateProfileOnHive(profileData)
      toast({
        title: "Profile Updated",
        description: `Transaction ID: ${updateResult.transactionId}`,
      })
    } catch (error) {
      toast({
        title: "Profile Update Failed",
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
          <CardTitle>Profile & Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="john@example.com" type="email" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="role">Role</Label>
                    <RadioGroup defaultValue="consumer">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manufacturer" id="manufacturer" />
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="distributor" id="distributor" />
                        <Label htmlFor="distributor">Distributor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="consumer" id="consumer" />
                        <Label htmlFor="consumer">Consumer</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder="Enter new password"
                        type={showPassword ? "text" : "password"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-6" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="settings">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email about your account activity</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}