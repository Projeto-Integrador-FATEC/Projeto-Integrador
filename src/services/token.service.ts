import { jwtVerify, SignJWT } from "jose";
import { ITokenService } from "./interfaces/token-service.interface";

const EXPIRATION = "24h";

export class TokenService implements ITokenService {
  async generate(email: string, role: string): Promise<string> {
    return new SignJWT({ role })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(email)
      .setIssuedAt()
      .setExpirationTime(EXPIRATION)
      .sign(this.getKey());
  }

  async extractRole(token: string): Promise<string> {
    const { payload } = await jwtVerify(token, this.getKey());

    if (typeof payload.role !== "string") {
      throw new Error("Token sem role");
    }

    return payload.role;
  }

  private getKey() {
    const secret = process.env.JWT_SECRET ?? process.env.AUTH_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET ou AUTH_SECRET não configurado");
    }

    return new TextEncoder().encode(secret);
  }
}
