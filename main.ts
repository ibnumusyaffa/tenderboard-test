import { Technician, Customer, ServiceCenter, getRandomPhoneSeries } from "./service-center.js";


// Create Technician
const dalton = new Technician("Dalton", 15);
const wapol = new Technician("Wapol", 25);
const technicians = [dalton, wapol];

// Create 10 customers
const customers = new Array(10).fill(null).map((_, index) => {
  const customer = new Customer(`Customer ${index}`, getRandomPhoneSeries());
  return customer;
});

// Create Service Center
const serviceCenter: ServiceCenter = new ServiceCenter(
  "First SC",
  "Long Ring Long Land Street",
  technicians,
  customers
);

// Print customer on queue
console.log("Customer on queue: ");
console.table(customers);
console.log("\n");

// Start Operating
console.log(`${serviceCenter.name} start operating today: `);
serviceCenter.startOperating().catch((err) => console.log(err));




