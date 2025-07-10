import { APIGatewayProxyHandler } from "aws-lambda";
import { SupabaseUserRepository } from "../database/SupabaseUserRepository";
import { AuthenticateUser } from "../../application/use-cases/AuthenticateUser";

const userRepository = new SupabaseUserRepository();
const authenticateUser = new AuthenticateUser(userRepository);

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        },
        body: JSON.stringify({ message: "Username and password are required" }),
      };
    }

    const token = await authenticateUser.execute(username, password);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      },
      body: JSON.stringify({
        message: "Authentication successful",
        token: token,
        expiresIn: "24h",
      }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      },
      body: JSON.stringify({
        message:
          error instanceof Error ? error.message : "Authentication failed",
      }),
    };
  }
};
