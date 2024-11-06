'use client'

import { useState } from 'react'
import { Key } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function Login() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const checkForKeychain = () => {
    return new Promise((resolve) => {
      if (window.hive_keychain) {
        resolve(true);
      } else {
        // Check again after a short delay to allow extension to inject
        setTimeout(() => {
          resolve(!!window.hive_keychain);
        }, 500);
      }
    });
  };

  const loginWithKeychain = async (username) => {
    try {
      // First check if Keychain is installed
      const isKeychainInstalled = await checkForKeychain();
      
      if (!isKeychainInstalled) {
        throw new Error('Please install Hive Keychain extension first.');
      }

      // Random memo to sign for authentication
      const memo = `Login-${Math.random().toString(36).substring(2)}`;
      
      // Request signature from Keychain
      return new Promise((resolve, reject) => {
        window.hive_keychain.requestSignBuffer(
          username,
          memo,
          'Posting',  // Using posting authority
          (response) => {
            if (response.success) {
              resolve({
                success: true,
                username: username,
                memo: memo,
                signature: response.result
              });
            } else {
              reject(new Error(response.message));
            }
          }
        );
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const loginResult = await loginWithKeychain(username);
      toast({
        title: "Login Successful",
        description: `Welcome, ${loginResult.username}!`,
      });
      // Here you would typically:
      // 1. Send the signature to your backend for verification
      // 2. Get back a session token
      // 3. Store the token and redirect to the main app
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login to SupplyChainX</CardTitle>
          <CardDescription>Enter your Hive username to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Hive Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your Hive username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-6" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                <>
                  <Key className="mr-2 h-4 w-4" /> Login with Keychain
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have a Hive account? <a href="https://signup.hive.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Create one here</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}