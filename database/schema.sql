-- Smart Apartment Management System Schema
-- Step 1: Database Schema

CREATE DATABASE IF NOT EXISTS smart_apartment;
USE smart_apartment;

-- 1. Flats Table
CREATE TABLE IF NOT EXISTS Flats (
    flat_id INT AUTO_INCREMENT PRIMARY KEY,
    flat_number VARCHAR(10) NOT NULL,
    floor INT NOT NULL,
    block ENUM('A', 'B', 'C', 'D') NOT NULL,
    building_name VARCHAR(50) NOT NULL,
    type ENUM('1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse') NOT NULL,
    area_sqft DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (block, flat_number), -- Unique per block
    INDEX (flat_number)
);

-- 2. Residents Table (Base Table)
CREATE TABLE IF NOT EXISTS Residents (
    resident_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    resident_type ENUM('Owner', 'Tenant', 'Admin') NOT NULL,
    ownership_type ENUM('Owner', 'Tenant') DEFAULT 'Owner',
    flat_id INT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    move_in_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE SET NULL,
    UNIQUE KEY (flat_id), -- Ensure One Resident Per Flat
    INDEX (email)
);

-- 3. Owners Table (ISA Resident)
CREATE TABLE IF NOT EXISTS Owners (
    resident_id INT PRIMARY KEY,
    ownership_date DATE NOT NULL,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id) ON DELETE CASCADE
);

-- 4. Tenants Table (ISA Resident)
CREATE TABLE IF NOT EXISTS Tenants (
    resident_id INT PRIMARY KEY,
    rent DECIMAL(15, 2) NOT NULL,
    lease_start DATE NOT NULL,
    lease_end DATE NOT NULL,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id) ON DELETE CASCADE
);

-- 5. Rooms Table
CREATE TABLE IF NOT EXISTS Rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    size DECIMAL(10, 2),
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE CASCADE
);

-- 6. Parking Table
CREATE TABLE IF NOT EXISTS Parking (
    parking_id INT AUTO_INCREMENT PRIMARY KEY,
    parking_number VARCHAR(20) NOT NULL UNIQUE,
    parking_type ENUM('Covered', 'Open', 'Basement') NOT NULL,
    flat_id INT,
    status ENUM('Available', 'Occupied') DEFAULT 'Available',
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE SET NULL
);

-- 7. Vehicles Table
CREATE TABLE IF NOT EXISTS Vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type ENUM('Car', 'Bike', 'Bicycle', 'Other') NOT NULL,
    resident_id INT NOT NULL,
    parking_id INT UNIQUE,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id) ON DELETE CASCADE,
    FOREIGN KEY (parking_id) REFERENCES Parking(parking_id) ON DELETE SET NULL,
    INDEX (vehicle_number)
);

-- 8. Facilities Table
CREATE TABLE IF NOT EXISTS Facilities (
    facility_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    capacity INT DEFAULT 0
);

-- 9. Bookings Table
CREATE TABLE IF NOT EXISTS Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    facility_id INT NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status ENUM('Confirmed', 'Cancelled', 'Completed') DEFAULT 'Confirmed',
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id) ON DELETE CASCADE,
    FOREIGN KEY (facility_id) REFERENCES Facilities(facility_id) ON DELETE CASCADE,
    UNIQUE KEY (facility_id, booking_date, time_slot) -- Prevents conflict
);

-- 10. Complaints Table
CREATE TABLE IF NOT EXISTS Complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    complaint_type VARCHAR(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id) ON DELETE CASCADE
);

-- 11. Maintenance Table
CREATE TABLE IF NOT EXISTS Maintenance (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    status ENUM('Unpaid', 'Paid', 'Partial', 'Overdue') DEFAULT 'Unpaid',
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE CASCADE
);

-- 12. Notices Table
CREATE TABLE IF NOT EXISTS Notices (
    notice_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Visitors Table
CREATE TABLE IF NOT EXISTS Visitors (
    visitor_id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE CASCADE
);

-- 14. Security Staff Table
CREATE TABLE IF NOT EXISTS Security (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    shift ENUM('Morning', 'Afternoon', 'Night') NOT NULL
);

-- 15. Entry Logs Table
CREATE TABLE IF NOT EXISTS EntryLogs (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT NOT NULL,
    staff_id INT NOT NULL,
    entry_time DATETIME NOT NULL,
    exit_time DATETIME,
    FOREIGN KEY (visitor_id) REFERENCES Visitors(visitor_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Security(staff_id) ON DELETE CASCADE
);

-- 16. Furniture Table
CREATE TABLE IF NOT EXISTS Furniture (
    furniture_id INT AUTO_INCREMENT PRIMARY KEY,
    flat_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    furniture_type VARCHAR(50),
    FOREIGN KEY (flat_id) REFERENCES Flats(flat_id) ON DELETE CASCADE
);
