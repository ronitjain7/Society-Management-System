require('dotenv').config();
const { sequelize, Flat, Resident, Maintenance, Payment, Complaint, Visitor, Notice, Facility } = require('./models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('Force syncing database...');
    // Force sync deletes all data and recreates tables based on models
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');

    // 1. Seed Flats
    console.log('Seeding Flats...');
    const blocks = ['A', 'B', 'C', 'D'];
    const floorCounts = 5;
    const flatsPerFloor = 4;
    const flatTypes = ['1BHK', '2BHK', '3BHK', '4BHK', 'Penthouse'];
    
    const flatsData = [];
    let flatId = 1;
    for (const block of blocks) {
        for (let floor = 1; floor <= floorCounts; floor++) {
            for (let num = 1; num <= flatsPerFloor; num++) {
                const flatNumber = `${floor}${num.toString().padStart(2, '0')}`;
                flatsData.push({
                    flat_number: flatNumber,
                    floor: floor,
                    block: block,
                    building_name: 'Smart Living Heights',
                    type: flatTypes[Math.floor(Math.random() * flatTypes.length)],
                    area_sqft: 800 + Math.floor(Math.random() * 1200)
                });
            }
        }
    }
    const createdFlats = await Flat.bulkCreate(flatsData.slice(0, 20)); // Just 20 for now as requested
    console.log('20 Flats seeded.');

    // 2. Seed Residents
    console.log('Seeding Residents...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const firstNames = ['Amit', 'Raj', 'Priya', 'Sneha', 'Vijay', 'Rahul', 'Anita', 'Sanjay', 'Meera', 'Karan', 'Deepa', 'Rohan', 'Neelam', 'Sunil', 'Kavita', 'Arjun', 'Simran', 'Ishaan', 'Tanvi', 'Manish'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Jain', 'Patel', 'Singh', 'Reddy', 'Nair', 'Iyer', 'Deshmukh', 'Kapoor', 'Malhotra', 'Bose', 'Chatterjee', 'Mishra', 'Yadav', 'Khan', 'Kulkarni', 'Joshi', 'Mehta'];
    
    const residentsData = [];
    for (let i = 0; i < 20; i++) {
        residentsData.push({
            first_name: firstNames[i],
            last_name: lastNames[i],
            email: `resident${i+1}@example.com`,
            phone: `98765432${i.toString().padStart(2, '0')}`,
            password: hashedPassword,
            resident_type: i === 0 ? 'Admin' : (i < 15 ? 'Owner' : 'Tenant'),
            ownership_type: i < 15 ? 'Owner' : 'Tenant',
            flat_id: createdFlats[i].flat_id,
            status: 'Active',
            move_in_date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0]
        });
    }
    const createdResidents = await Resident.bulkCreate(residentsData);
    console.log('20 Residents seeded.');

    // 3. Seed Maintenance Bills & Payments
    console.log('Seeding Maintenance & Payments...');
    const maintenanceData = [];
    for (let i = 0; i < 15; i++) {
        maintenanceData.push({
            flat_id: createdFlats[i].flat_id,
            amount: 2500 + Math.floor(Math.random() * 1500),
            due_date: new Date(Date.now() + (i-5) * 1000 * 60 * 60 * 24 * 10).toISOString().split('T')[0],
            status: i < 10 ? 'Paid' : 'Unpaid'
        });
    }
    const createdBills = await Maintenance.bulkCreate(maintenanceData);
    
    // Payments for paid bills
    const paymentsData = [];
    for (let i = 0; i < 10; i++) {
        paymentsData.push({
            maintenance_id: createdBills[i].maintenance_id,
            amount_paid: createdBills[i].amount,
            payment_date: new Date(),
            payment_mode: 'Online',
            transaction_id: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
    }
    await Payment.bulkCreate(paymentsData);
    console.log('Maintenance bills and payments seeded.');

    // 4. Seed Complaints
    console.log('Seeding Complaints...');
    const subjects = ['Leaking Pipe', 'Power Cut', 'Lift Not Working', 'Noisy Neighbors', 'Parking Dispute', 'Security Concern'];
    const complaintsData = [];
    for (let i = 0; i < 10; i++) {
        complaintsData.push({
            resident_id: createdResidents[i+1].resident_id,
            subject: subjects[i % subjects.length],
            description: `Auto-generated complaint number ${i+1}. Needs urgent attention.`,
            status: i < 5 ? 'Open' : (i < 8 ? 'In Progress' : 'Resolved'),
            priority: i % 3 === 0 ? 'High' : (i % 2 === 0 ? 'Medium' : 'Low'),
            category: i % 2 === 0 ? 'Plumbing' : 'Electrical'
        });
    }
    await Complaint.bulkCreate(complaintsData);
    console.log('10 Complaints seeded.');

    // 5. Seed Visitors
    console.log('Seeding Visitors...');
    const visitorNames = ['Rahul Guest', '快递员', 'Pest Control', 'Sunil Relative', 'Gifts Delivery'];
    for (let i = 0; i < 10; i++) {
        await Visitor.create({
            flat_id: createdFlats[Math.floor(Math.random() * 20)].flat_id,
            name: visitorNames[i % visitorNames.length],
            phone: '900000000' + i,
            purpose: 'Delivery/Guest',
            visit_date: new Date()
        });
    }
    console.log('10 Visitors seeded.');

    // 6. Seed Notices
    console.log('Seeding Notices...');
    const notices = [
        { title: 'Annual General Meeting', content: 'The AGM will be held this Sunday at the Community Hall.' },
        { title: 'Elevator Maintenance', content: 'Lift B will be down for maintenance on Monday from 10 AM to 2 PM.' },
        { title: 'Republic Day Celebration', content: 'Join us for flag hoisting at 9 AM in the main garden.' },
        { title: 'Water Tank Cleaning', content: 'Water supply will be affected on Friday between 1 PM and 5 PM.' },
        { title: 'New Security Rules', content: 'All visitors must mandatorily register at the main gate.' }
    ];
    await Notice.bulkCreate(notices);
    console.log('5 Notices seeded.');

    console.log('DATABASE SEEDING COMPLETE!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
