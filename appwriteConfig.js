import { Client, Account, Databases } from "appwrite";

const appwrite = new Client();

appwrite
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your endpoint
  .setProject("abc123def456ghi789jklmnopqrstuvwxyz0"); // Replace with your project ID

const account = new Account(appwrite);
const database = new Databases(appwrite);

export { appwrite, account, database };
