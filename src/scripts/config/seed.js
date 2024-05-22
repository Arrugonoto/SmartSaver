const { db } = require('@vercel/postgres');

async function createUsersTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_At TIMESTAMP NOT NULL
      );
    `;

    console.log(`Created "users" table`);
  } catch (error) {
    console.error('Error while creating users table:', error);
    throw error;
  }
}

async function createExpensesSummaryTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "expenses_summary" table if doesn't exist
    // Changed amount data type from INT to NUMERIC
    // to be able to store floating number values
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS expenses_summary (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        total_amount NUMERIC(40, 2) NOT NULL
      );
    `;

    console.log(`Created "expenses_summary" table`);
  } catch (error) {
    console.error('Error while creating expenses_summary table:', error);
    throw error;
  }
}

async function createExpensesTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "expenses" table if doesn't exist
    // Changed amount data type from INT to NUMERIC
    // to be able to store floating number values
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        amount NUMERIC(500, 2) NOT NULL,
        expense_type VARCHAR(255) NOT NULL,
        payment_type VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        created_At TIMESTAMP NOT NULL,
        updated_At TIMESTAMP
      );
    `;

    console.log(`Created "expenses" table`);
  } catch (error) {
    console.error('Error while creating expenses table:', error);
    throw error;
  }
}

async function createBudgetLimitTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "budget limit" table if doesn't exist
    const createTable = await client.sql`
       CREATE TABLE IF NOT EXISTS budget (
         id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
         user_id UUID NOT NULL,
         budget_limit NUMERIC(1000, 2) NOT NULL,
         created_At TIMESTAMP NOT NULL,
         updated_At TIMESTAMP
       );
     `;

    console.log(`Created "budget limit" table`);
  } catch (error) {
    console.error('Error while creating budget table:', error);
    throw error;
  }
}

async function initDatabase() {
  const client = await db.connect();
  await createUsersTable(client);
  await createExpensesSummaryTable(client);
  await createExpensesTable(client);

  await client.end();
}

initDatabase().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err
  );
});
