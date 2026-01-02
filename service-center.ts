function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export class Technician {
  name: string;
  averageRepairTime: number;

  constructor(name: string, averageRepairTime: number) {
    this.name = name;
    this.averageRepairTime = averageRepairTime;
  }

  async repairing(customer: Customer): Promise<Customer> {
    console.log(
      `>> Technician ${this.name} is repairing ${customer.name}'s phone. Customer phone is ${customer.phoneSeries} series <<`
    );

    // Simulate repair time
    await sleep(this.averageRepairTime);

    // Mark as completed
    console.log(`REPAIRING DONE: ${this.name} FIXED ${customer.name}'s phone!`);

    return customer;
  }
}

export class Customer {
  name: string;
  phoneSeries: string;

  constructor(name: string, phoneSeries: string) {
    this.name = name;
    this.phoneSeries = phoneSeries;
  }
}

export class ServiceCenter {
  readonly name: string;
  readonly address: string;

  private readonly technicians: Technician[];
  private customerQueue: Customer[];

   logs: Array<{
    customerName: string;
    phone: string;
    phoneRepairedBy: string;
  }> = [];

  constructor(
    name: string,
    address: string,
    technicians: Technician[],
    customers: Customer[]
  ) {
    this.name = name;
    this.address = address;
    this.technicians = technicians;
    this.customerQueue = [...customers];
  }

  async startOperating(): Promise<void> {
    // Start all technicians working concurrently
    // Each technician will recursively process customers from the queue
    const technicianPromises = this.technicians.map((technician) =>
      this.technicianWorkLoop(technician)
    );

    // Wait for all technicians to finish (when queue is empty)
    await Promise.all(technicianPromises);

    console.log("Service centre log for today:");
    console.table(this.logs);
  }

  private async technicianWorkLoop(technician: Technician) {
    const customer = this.getNextCustomer();
    if (!customer) {
      return; // exit when no more customers
    }

    await technician.repairing(customer);
    this.logs.push({
      customerName: customer.name,
      phone: customer.phoneSeries,
      phoneRepairedBy: technician.name,
    });
    console.log(`${technician.name} available, call another customer...`);

    // Recursive: Process next customer
    return this.technicianWorkLoop(technician);
  }

  // Get next customer from queue
  private getNextCustomer() {
    return this.customerQueue.shift();
  }


}

export function getRandomPhoneSeries(): string {
  const phoneSeries = ["Jaguar", "Leopard", "Lion"];
  const randomIndex = Math.floor(Math.random() * phoneSeries.length);
  return phoneSeries[randomIndex];
}

