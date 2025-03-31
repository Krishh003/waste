"use server";

import { createConnection } from './db';
import { RouteOptimizer } from './routeOptimizer';

export async function getBins() {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute('SELECT * FROM bins ORDER BY current_fill_level DESC');
    return rows;
  } finally {
    await connection.end();
  }
}

export async function addBin(location: string, latitude: number, longitude: number, capacity: number) {
  const connection = await createConnection();
  try {
    await connection.execute(
      'INSERT INTO bins (location, latitude, longitude, capacity) VALUES (?, ?, ?, ?)',
      [location, latitude, longitude, capacity]
    );
  } finally {
    await connection.end();
  }
}

export async function updateBinFillLevel(binId: number, fillLevel: number) {
  const connection = await createConnection();
  try {
    await connection.execute(
      'UPDATE bins SET current_fill_level = ? WHERE id = ?',
      [fillLevel, binId]
    );
  } finally {
    await connection.end();
  }
}

export async function getDriverRoute(driverId: number) {
  const connection = await createConnection();
  try {
    const [route] = await connection.execute(
      `SELECT r.*, rb.*, b.*
       FROM routes r
       JOIN route_bins rb ON r.id = rb.route_id
       JOIN bins b ON rb.bin_id = b.id
       WHERE r.driver_id = ? AND r.status = 'in_progress'
       ORDER BY rb.sequence_number`,
      [driverId]
    );
    return route;
  } finally {
    await connection.end();
  }
}

export async function markBinCollected(routeId: number, binId: number) {
  const connection = await createConnection();
  try {
    await connection.beginTransaction();
    
    // Update route_bins status
    await connection.execute(
      'UPDATE route_bins SET status = "completed" WHERE route_id = ? AND bin_id = ?',
      [routeId, binId]
    );
    
    // Update bin fill level and last collection
    await connection.execute(
      'UPDATE bins SET current_fill_level = 0, last_collection = NOW() WHERE id = ?',
      [binId]
    );
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

export async function generateOptimizedRoutes() {
  const connection = await createConnection();
  try {
    // Get all bins that need collection (fill level > 50%)
    const [bins] = await connection.execute(
      'SELECT * FROM bins WHERE current_fill_level > (capacity * 0.5)'
    );

    // Define depot location (this should come from configuration)
    const depot: [number, number] = [-73.935242, 40.730610]; // Example: NYC coordinates

    // Create route optimizer
    const optimizer = new RouteOptimizer(
      bins as any[],
      depot,
      100, // max route distance in km
      10000 // vehicle capacity in liters
    );

    // Generate optimized routes
    const optimizedRoutes = optimizer.optimizeRoutes();

    // Store routes in database
    await connection.beginTransaction();

    for (const route of optimizedRoutes) {
      // Create new route
      const [routeResult] = await connection.execute(
        'INSERT INTO routes (driver_id, date, status) VALUES (?, CURDATE(), "pending")',
        [1] // Assign to default driver for now
      );
      const routeId = (routeResult as any).insertId;

      // Add bins to route
      for (let i = 0; i < route.length; i++) {
        await connection.execute(
          'INSERT INTO route_bins (route_id, bin_id, sequence_number) VALUES (?, ?, ?)',
          [routeId, route[i], i + 1]
        );
      }
    }

    await connection.commit();
    return optimizedRoutes;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}