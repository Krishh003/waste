-- Create bins table
CREATE TABLE IF NOT EXISTS bins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  capacity INT NOT NULL,
  current_fill_level INT DEFAULT 0,
  last_collection DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create collection_history table
CREATE TABLE IF NOT EXISTS collection_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id INT NOT NULL,
  fill_level_before INT NOT NULL,
  collection_date DATETIME NOT NULL,
  driver_id INT NOT NULL,
  fuel_used DECIMAL(10, 2),
  distance_covered DECIMAL(10, 2),
  FOREIGN KEY (bin_id) REFERENCES bins(id)
);

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Create route_bins table
CREATE TABLE IF NOT EXISTS route_bins (
  route_id INT NOT NULL,
  bin_id INT NOT NULL,
  sequence_number INT NOT NULL,
  status ENUM('pending', 'completed') DEFAULT 'pending',
  PRIMARY KEY (route_id, bin_id),
  FOREIGN KEY (route_id) REFERENCES routes(id),
  FOREIGN KEY (bin_id) REFERENCES bins(id)
);