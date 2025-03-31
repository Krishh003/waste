import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Binary as GarbageBin, Truck, MapPin, Fuel, BarChart3, Route } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <GarbageBin className="h-6 w-6" />
            <h1 className="text-xl font-bold">Smart Waste Management</h1>
          </div>
          <nav className="ml-auto flex items-center space-x-4">
            <Link href="/admin">
              <Button>Management Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container px-4 py-6">
          <div className="grid gap-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">City Waste Management Platform</h2>
              <p className="text-lg text-muted-foreground mt-2">
                Optimize resource allocation and reduce environmental impact
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Strategic Planning
                  </CardTitle>
                  <CardDescription>Optimize bin placement and collection routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Data-driven decisions for waste management infrastructure</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Resource Analytics
                  </CardTitle>
                  <CardDescription>Track and optimize resource allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Monitor fleet utilization and operational efficiency</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="h-5 w-5" />
                    Sustainability Metrics
                  </CardTitle>
                  <CardDescription>Environmental impact analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track carbon footprint and sustainability goals</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Infrastructure</TabsTrigger>
                <TabsTrigger value="stats">Performance</TabsTrigger>
                <TabsTrigger value="impact">Sustainability</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Infrastructure Planning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Optimize bin placement and capacity based on population density and usage patterns</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Fleet Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Track vehicle utilization and maintenance schedules</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="stats">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Operational Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Monitor collection efficiency and resource utilization</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Track operational costs and identify optimization opportunities</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="impact">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Environmental Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Monitor carbon emissions and environmental metrics</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Sustainability Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Track progress towards environmental targets</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="border-t">
        <div className="container flex h-16 items-center px-4">
          <p className="text-sm text-muted-foreground">
            © 2024 City Waste Management Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}