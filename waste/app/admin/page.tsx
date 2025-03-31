"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Truck, BarChart3, Plus, Binary, Route as RouteIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const mockData = {
  bins: [
    { id: 1, location: "Downtown District", fillLevel: 75, lastCollection: "2024-03-20", capacity: 1000 },
    { id: 2, location: "Residential Zone A", fillLevel: 45, lastCollection: "2024-03-19", capacity: 800 },
    { id: 3, location: "Commercial District", fillLevel: 90, lastCollection: "2024-03-18", capacity: 1200 },
  ],
  analytics: [
    { date: '2024-03-15', overflow: 5, fuelSaved: 25, distanceSaved: 15, costSaved: 450 },
    { date: '2024-03-16', overflow: 3, fuelSaved: 30, distanceSaved: 20, costSaved: 600 },
    { date: '2024-03-17', overflow: 4, fuelSaved: 28, distanceSaved: 18, costSaved: 520 },
    { date: '2024-03-18', overflow: 2, fuelSaved: 35, distanceSaved: 22, costSaved: 680 },
  ],
  resources: {
    totalBins: 45,
    activeTrucks: 8,
    averageCollectionTime: 25,
    fuelEfficiency: 85
  }
};

export default function AdminDashboard() {
  const [newBin, setNewBin] = useState({ location: '', capacity: '', latitude: '', longitude: '' });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">City Management Dashboard</h1>
        </div>
      </header>

      <main className="container px-4 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="routes">Route Planning</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Binary className="h-5 w-5" />
                    Total Bins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.resources.totalBins}</div>
                  <p className="text-sm text-muted-foreground">Active waste bins</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Active Trucks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.resources.activeTrucks}</div>
                  <p className="text-sm text-muted-foreground">Collection vehicles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RouteIcon className="h-5 w-5" />
                    Collection Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.resources.averageCollectionTime}min</div>
                  <p className="text-sm text-muted-foreground">Average per bin</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Fuel Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.resources.fuelEfficiency}%</div>
                  <p className="text-sm text-muted-foreground">Route optimization</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="infrastructure">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Bin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location Description</Label>
                      <Input
                        id="location"
                        value={newBin.location}
                        onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Capacity (in liters)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={newBin.capacity}
                        onChange={(e) => setNewBin({ ...newBin, capacity: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.000001"
                          value={newBin.latitude}
                          onChange={(e) => setNewBin({ ...newBin, latitude: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.000001"
                          value={newBin.longitude}
                          onChange={(e) => setNewBin({ ...newBin, longitude: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button>Add Bin</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Infrastructure Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {mockData.bins.map((bin) => (
                      <div key={bin.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{bin.location}</h3>
                          <p className="text-sm text-muted-foreground">Capacity: {bin.capacity}L</p>
                          <p className="text-sm text-muted-foreground">Last collection: {bin.lastCollection}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{bin.fillLevel}%</p>
                            <p className="text-sm text-muted-foreground">Fill Level</p>
                          </div>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5" />
                  Route Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Current Routes</h3>
                      <p className="text-sm text-muted-foreground">Optimize collection routes based on fill levels and priorities</p>
                    </div>
                    <Button>Generate Routes</Button>
                  </div>
                  <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Route visualization coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    System Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <LineChart
                      width={800}
                      height={400}
                      data={mockData.analytics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="overflow" stroke="#ff0000" name="Overflow Incidents" />
                      <Line type="monotone" dataKey="fuelSaved" stroke="#00ff00" name="Fuel Saved (L)" />
                      <Line type="monotone" dataKey="distanceSaved" stroke="#0000ff" name="Distance Saved (km)" />
                      <Line type="monotone" dataKey="costSaved" stroke="#purple" name="Cost Saved ($)" />
                    </LineChart>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}