import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../domain/repositories/UserRepository";

export class AuthenticateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(username: string, password: string): Promise<string> {
    try {
      const user = await this.userRepository.findByUsername(username);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generar token con estructura específica para API Gateway
      const token = jwt.sign(
        { 
          sub: user.id.toString(), // subject (user ID)
          username: user.username,
          role: user.role,
          iss: "auth-service", // issuer
          aud: "api-gateway" // audience
        },
        process.env.JWT_SECRET || "default-secret",
        { 
          expiresIn: "24h",
          algorithm: "HS256"
        }
      );

      return token;
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}