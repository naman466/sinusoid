'use client'

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockTrackingData = {
  id: '1234567890',
  product: 'Smartphone XYZ',
  status: 'In Transit',
  origin: 'Shanghai, China',
  destination: 'New York, USA',
  timeline: [
    { date: '2023-06-01', status: 'Order Placed', location: 'Online' },
    { date: '2023-06-02', status: 'Processing', location: 'Shanghai, China' },
    { date: '2023-06-03', status: 'Shipped', location: 'Shanghai, China' },
    { date: '2023-06-05', status: 'In Transit', location: 'Hong Kong' },
    { date: '2023-06-07', status: 'In Transit', location: 'Anchorage, USA' },
  ]
};

const Tracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const getTrackingDataFromHive = async (trackingId) => {
    try {
      // First check if Keychain is installed
      const isKeychainInstalled = await checkForKeychain();
      if (!isKeychainInstalled) {
        throw new Error('Please install Hive Keychain extension first.');
      }

      // Random memo to sign the transaction
      const memo = `Tracking request - ${trackingId}`;

      // Request data from Keychain
      return new Promise((resolve, reject) => {
        window.hive_keychain.requestCustomJson(
          'your-hive-username', // Replace with your Hive username
          'supplychain', // Contract name
          'active', // Permission level
          JSON.stringify({
            contractName: 'supplychain',
            action: 'getTrackingData',
            payload: {
              trackingId: trackingId
            }
          }),
          memo,
          (response) => {
            if (response.success) {
              resolve(JSON.parse(response.result));
            } else {
              reject(new Error(response.message));
            }
          }
        );
      });
    } catch (error) {
      console.error('Tracking data fetch error:', error);
      throw error;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const trackingData = await getTrackingDataFromHive(trackingId);
      setTrackingResult(trackingData);
    } catch (error) {
      toast({
        title: "Tracking Data Fetch Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Shipment</CardTitle>
          <CardDescription>Enter your tracking ID to get real-time updates on your shipment</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="trackingId">Tracking ID</Label>
              <Input
                type="text"
                id="trackingId"
                placeholder="Enter tracking ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="mt-6" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Tracking...
                </div>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Track
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {trackingResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tracking Result</CardTitle>
            <CardDescription>Tracking ID: {trackingResult.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Product</p>
                  <p className="text-sm text-gray-500">{trackingResult.product}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-gray-500">{trackingResult.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Origin</p>
                  <p className="text-sm text-gray-500">{trackingResult.origin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-sm text-gray-500">{trackingResult.destination}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Timeline</p>
                <ol className="relative border-l border-gray-200">
                  {trackingResult.timeline.map((event, index) => (
                    <li key={index} className="mb-10 ml-4">
                      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400">{event.date}</time>
                      <h3 className="text-lg font-semibold">{event.status}</h3>
                      <p className="mb-4 text-base font-normal text-gray-500">{event.location}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" /> Verify on Blockchain
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Tracking;