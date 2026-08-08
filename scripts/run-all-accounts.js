const { spawnSync } = require("child_process");
const path = require("path");
const accounts = require("../cypress/fixtures/accounts.json");

if (!accounts.length) {
  console.error("cypress/fixtures/accounts.json is empty — add at least one account.");
  process.exit(1);
}

const failedAccounts = [];

for (const account of accounts) {
  console.log(`\n=== Running suite for account: ${account.id} (${account.email}) ===\n`);

  const result = spawnSync(
    "npx",
    [
      "cypress",
      "run",
      "--env",
      `accountId=${account.id},accountEmail=${account.email},accountPassword=${account.password}`,
      "--config",
      `videosFolder=cypress/videos/${account.id},screenshotsFolder=cypress/screenshots/${account.id}`,
      "--reporter-options",
      `reportDir=${path.join("cypress/reports", account.id)}`,
    ],
    { stdio: "inherit", shell: true }
  );

  if (result.status !== 0) {
    failedAccounts.push(account.id);
  }
}

console.log("\n=== Multi-account run summary ===");
console.log(`Total accounts: ${accounts.length}`);
console.log(`Failed accounts: ${failedAccounts.length ? failedAccounts.join(", ") : "none"}`);

process.exit(failedAccounts.length ? 1 : 0);
