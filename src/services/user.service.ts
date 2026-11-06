import bcrypt from "bcryptjs";
import { HttpError } from "@/lib/http-error";
import { CreateUserData, User } from "@/models/user.model";
import { IUserRepository } from "@/repositories/interfaces/user-repository.interface";
import { IUserService } from "./interfaces/user-service.interface";

const DEFAULT_ROLE = "ALUNO";
const SALT_ROUNDS = 10;

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

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

    const existing = await this.userRepository.findByEmail(data.email);

    if (existing) {
      throw new HttpError("E-mail já cadastrado", 409);
    }

    const password = await bcrypt.hash(data.password, SALT_ROUNDS);

    return this.userRepository.create({ ...data, password, role: DEFAULT_ROLE });
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const { password: _password, ...publicUser } = user;
    return publicUser;
  }
}
