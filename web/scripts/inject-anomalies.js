const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Generating suspicious transaction...');
  
  // High Velocity Transaction (Over 1500 XLM)
  await prisma.transaction.create({
    data: {
      beneficiary: 'GABCD...BENEFICIARY',
      type: 'spend',
      merchant: 'Gmall of Davao',
      category: 'Groceries & Food',
      amount: 2500, // This is over the 1500 limit, will trigger alert!
      status: 'Completed',
      txHash: '0x' + Math.random().toString(36).substring(2, 15),
      date: new Date()
    }
  });

  // Night time transaction
  const nightDate = new Date();
  nightDate.setHours(2, 0, 0, 0); // 2 AM
  await prisma.transaction.create({
    data: {
      beneficiary: 'GXYZ...BENEFICIARY',
      type: 'spend',
      merchant: 'Mercury Drug',
      category: 'Medicines',
      amount: 150, 
      status: 'Completed',
      txHash: '0x' + Math.random().toString(36).substring(2, 15),
      date: nightDate
    }
  });

  console.log('Suspicious transactions injected successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
