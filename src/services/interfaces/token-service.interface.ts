export interface ITokenService {
  generate(email: string, role: string): Promise<string>;
  extractRole(token: string): Promise<string>;
}
