import { HttpError } from "@/lib/http-error";
import { CreateUserData, LoginResult, User } from "@/models/user.model";
import { IAuthRepository } from "@/repositories/interfaces/auth-repository.interface";
import { IUserRepository } from "@/repositories/interfaces/user-repository.interface";
import { IUserService } from "./interfaces/user-service.interface";

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authRepository: IAuthRepository
  ) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpError("Usuário não encontrado", 404);
    }

    return user;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new HttpError("Usuário não encontrado", 404);
    }

    return user;
  }

  async create(data: CreateUserData): Promise<User> {
    if (!data.name || !data.email || !data.password) {
      throw new HttpError("Todos os campos são obrigatórios", 400);
    }

    return this.authRepository.signUp(data);
  }

  async login(email: string, password: string): Promise<LoginResult | null> {
    if (!email || !password) {
      throw new HttpError("Email e senha são obrigatórios", 400);
    }

    return this.authRepository.signIn(email, password);
  }

  async logout(headers: Headers): Promise<void> {
    await this.authRepository.signOut(headers);
  }

  async getSessionUser(headers: Headers): Promise<User | null> {
    return this.authRepository.getSessionUser(headers);
  }
}
