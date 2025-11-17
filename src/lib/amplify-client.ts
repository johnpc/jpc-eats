import { generateClient } from "aws-amplify/api";
import { Schema } from "../../amplify/data/resource";

export const publicClient = generateClient<Schema>({
  authMode: "iam",
});

export const client = generateClient<Schema>({
  authMode: "userPool",
});
