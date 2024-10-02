import { exec } from "child_process";
import cron from "node-cron";

const scrapeData = (fromCurr: string, toCurr: string, period: string): void => {
  const scriptPath = "scripts/forex_scrapper.py";
  const pythonPath = "c:/Users/Srinjoy Ghosh/node_projects/forex-api/.venv/Scripts/python.exe"
  const command = `"${pythonPath}" ${scriptPath} ${fromCurr} ${toCurr} ${period}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Python script error output: ${stderr}`);
      return;
    }
    console.log(`Python script output: ${stdout}`);
  });
};

export function scheduleScrapingTasks() {
  // scrapeData("GBP","INR", "1W");
  // cron.schedule("* * * * *", () => {
  //     console.log("Running GBP-INR and AED-INR 1W scrape");
  //     scrapeData("GBP","INR", "1W");
  //     scrapeData("AED","INR", "1W");
  //   });

  cron.schedule("0 0 * * 0", () => {
    console.log("Running GBP-INR and AED-INR 1W scrape");
    scrapeData("GBP", "INR", "1W");
    scrapeData("AED", "INR", "1W");
  });

  cron.schedule("0 0 1 * *", () => {
    console.log("Running GBP-INR and AED-INR 1M scrape");
    scrapeData("GBP", "INR", "1M");
    scrapeData("AED", "INR", "1M");
  });

  cron.schedule("0 0 1 */3 *", () => {
    console.log("Running GBP-INR and AED-INR 3M scrape");
    scrapeData("GBP", "INR", "3M");
    scrapeData("AED", "INR", "3M");
  });

  cron.schedule("0 0 1 */6 *", () => {
    console.log("Running GBP-INR and AED-INR 6M scrape");
    scrapeData("GBP", "INR", "6M");
    scrapeData("AED", "INR", "6M");
  });

  cron.schedule("0 0 1 1 *", () => {
    console.log("Running GBP-INR and AED-INR 1Y scrape");
    scrapeData("GBP", "INR", "1Y");
    scrapeData("AED", "INR", "1Y");
  });
}
