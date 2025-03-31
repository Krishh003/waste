import * as turf from '@turf/turf';

interface Bin {
  id: number;
  latitude: number;
  longitude: number;
  current_fill_level: number;
  capacity: number;
}

interface SavingsEntry {
  bin1: number;
  bin2: number;
  savings: number;
}

export class RouteOptimizer {
  private bins: Bin[];
  private depot: [number, number]; // [longitude, latitude]
  private maxRouteDistance: number; // in kilometers
  private vehicleCapacity: number; // in liters

  constructor(
    bins: Bin[],
    depot: [number, number],
    maxRouteDistance: number = 100,
    vehicleCapacity: number = 10000
  ) {
    this.bins = bins;
    this.depot = depot;
    this.maxRouteDistance = maxRouteDistance;
    this.vehicleCapacity = vehicleCapacity;
  }

  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    const from = turf.point(point1);
    const to = turf.point(point2);
    return turf.distance(from, to, { units: 'kilometers' });
  }

  private calculateSavings(): SavingsEntry[] {
    const savings: SavingsEntry[] = [];

    for (let i = 0; i < this.bins.length; i++) {
      for (let j = i + 1; j < this.bins.length; j++) {
        const bin1 = this.bins[i];
        const bin2 = this.bins[j];

        // Calculate distances
        const distanceDepotToBin1 = this.calculateDistance(
          this.depot,
          [bin1.longitude, bin1.latitude]
        );
        const distanceDepotToBin2 = this.calculateDistance(
          this.depot,
          [bin2.longitude, bin2.latitude]
        );
        const distanceBin1ToBin2 = this.calculateDistance(
          [bin1.longitude, bin1.latitude],
          [bin2.longitude, bin2.latitude]
        );

        // Calculate savings
        const saving = distanceDepotToBin1 + distanceDepotToBin2 - distanceBin1ToBin2;

        savings.push({
          bin1: bin1.id,
          bin2: bin2.id,
          savings: saving
        });
      }
    }

    // Sort savings in descending order
    return savings.sort((a, b) => b.savings - a.savings);
  }

  private getBinById(id: number): Bin {
    return this.bins.find(bin => bin.id === id)!;
  }

  private calculateRouteDistance(route: number[]): number {
    let distance = 0;
    
    // Distance from depot to first bin
    if (route.length > 0) {
      const firstBin = this.getBinById(route[0]);
      distance += this.calculateDistance(
        this.depot,
        [firstBin.longitude, firstBin.latitude]
      );
    }

    // Distance between consecutive bins
    for (let i = 0; i < route.length - 1; i++) {
      const currentBin = this.getBinById(route[i]);
      const nextBin = this.getBinById(route[i + 1]);
      distance += this.calculateDistance(
        [currentBin.longitude, currentBin.latitude],
        [nextBin.longitude, nextBin.latitude]
      );
    }

    // Distance from last bin to depot
    if (route.length > 0) {
      const lastBin = this.getBinById(route[route.length - 1]);
      distance += this.calculateDistance(
        [lastBin.longitude, lastBin.latitude],
        this.depot
      );
    }

    return distance;
  }

  private calculateRouteLoad(route: number[]): number {
    return route.reduce((total, binId) => {
      const bin = this.getBinById(binId);
      return total + bin.current_fill_level;
    }, 0);
  }

  optimizeRoutes(): number[][] {
    const savings = this.calculateSavings();
    const routes: number[][] = [];
    const usedBins = new Set<number>();

    // Initialize routes with high-priority bins (fill level > 80%)
    this.bins
      .filter(bin => (bin.current_fill_level / bin.capacity) * 100 > 80)
      .forEach(bin => {
        routes.push([bin.id]);
        usedBins.add(bin.id);
      });

    // Process remaining bins using savings algorithm
    for (const saving of savings) {
      const { bin1, bin2 } = saving;

      // Skip if either bin is already used
      if (usedBins.has(bin1) && usedBins.has(bin2)) continue;

      // Find routes containing bin1 or bin2
      const route1Index = routes.findIndex(r => r.includes(bin1));
      const route2Index = routes.findIndex(r => r.includes(bin2));

      // Case 1: Neither bin is in a route
      if (route1Index === -1 && route2Index === -1) {
        const newRoute = [bin1, bin2];
        const routeDistance = this.calculateRouteDistance(newRoute);
        const routeLoad = this.calculateRouteLoad(newRoute);

        if (routeDistance <= this.maxRouteDistance && routeLoad <= this.vehicleCapacity) {
          routes.push(newRoute);
          usedBins.add(bin1);
          usedBins.add(bin2);
        }
        continue;
      }

      // Case 2: One bin is in a route, other isn't
      if (route1Index === -1 || route2Index === -1) {
        const routeIndex = route1Index !== -1 ? route1Index : route2Index;
        const newBin = route1Index !== -1 ? bin2 : bin1;
        const route = routes[routeIndex];

        // Try adding to start or end of route
        const routeWithNewBin = route[0] === (route1Index !== -1 ? bin1 : bin2)
          ? [newBin, ...route]
          : [...route, newBin];

        const routeDistance = this.calculateRouteDistance(routeWithNewBin);
        const routeLoad = this.calculateRouteLoad(routeWithNewBin);

        if (routeDistance <= this.maxRouteDistance && routeLoad <= this.vehicleCapacity) {
          routes[routeIndex] = routeWithNewBin;
          usedBins.add(newBin);
        }
      }
    }

    // Add remaining bins to new routes
    this.bins
      .filter(bin => !usedBins.has(bin.id))
      .forEach(bin => {
        routes.push([bin.id]);
        usedBins.add(bin.id);
      });

    return routes;
  }
}