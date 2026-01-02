import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert";
import { Technician, Customer, ServiceCenter } from "./service-center.js";

describe("Customer", () => {
  it("should create a customer with name and phone series", () => {
    const customer = new Customer("John", "Jaguar");
    assert.strictEqual(customer.name, "John");
    assert.strictEqual(customer.phoneSeries, "Jaguar");
  });
});

describe("Technician", () => {
  it("should create a technician with name and average repair time", () => {
    const technician = new Technician("Dalton", 15);
    assert.strictEqual(technician.name, "Dalton");
    assert.strictEqual(technician.averageRepairTime, 15);
  });

  it("should take time proportional to averageRepairTime", async () => {
    mock.timers.enable({ apis: ["setTimeout"] });

    const repairTime = 60; // 60 seconds
    const technician = new Technician("TimedTech", repairTime);
    const customer = new Customer("Customer", "Lion");

    const repairPromise = technician.repairing(customer);

    // Jump to the future by the repair time
    mock.timers.tick(repairTime * 1000);

    const result = await repairPromise;

    assert.strictEqual(result, customer);

    mock.timers.reset();
  });
});

describe("ServiceCenter", () => {
  let technicians: Technician[];
  let customers: Customer[];

  beforeEach(() => {
    technicians = [
      new Technician("Dalton", 1),
      new Technician("Wapol", 1),
    ];

    customers = [
      new Customer("Customer1", "Jaguar"),
      new Customer("Customer2", "Leopard"),
      new Customer("Customer3", "Lion"),
    ];
  });

  it("should create a service center with correct properties", () => {
    const serviceCenter = new ServiceCenter(
      "Test SC",
      "Test Street",
      technicians,
      customers
    );

    assert.strictEqual(serviceCenter.name, "Test SC");
    assert.strictEqual(serviceCenter.address, "Test Street");
  });

  it("should process all customers in the queue", async () => {

    const serviceCenter = new ServiceCenter(
      "Test SC",
      "Test Street",
      technicians,
      customers
    );

    //mock the console.log and console.table
    const originalLog = console.log;
    const originalTable = console.table;
    console.log = () => { };
    console.table = () => { };

    await serviceCenter.startOperating();

    // Restore console methods
    console.log = originalLog;
    console.table = originalTable;


    // Check all customers were logged
    assert.strictEqual(serviceCenter.logs.length, customers.length);
    customers.forEach((customer) => {
      const log = serviceCenter.logs.find(l => l.customerName === customer.name);
      assert.ok(log);
    });
  });

});

