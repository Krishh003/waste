"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Route, AlertTriangle } from 'lucide-react';

const mockRoutes = [
  {
    id: 1,
    bins: [
      { id: 1, location: "Main St & 5th Ave", fillLevel: 90, priority: "high" },
      { id: 2, location: "Park Road", fillLevel: 45, priority: "low" },
      { id: 3, location: "Market Square", fillLevel: 85, priority: "high" },
    ],
    status: "in_progress"
  }
];

export default function DriverPortal() {
  const [activeRoute] = useState(mockRoutes[0]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">Driver Portal</h1>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Current Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {activeRoute.bins.map((bin) => (
                  <div key={bin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        bin.fillLevel >= 80 ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <h3 className="font-medium">{bin.location}</h3>
                        <p className="text-sm text-muted-foreground">Fill Level: {bin.fillLevel}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {bin.priority === "high" && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          High Priority
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">Mark Collected</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Route Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}