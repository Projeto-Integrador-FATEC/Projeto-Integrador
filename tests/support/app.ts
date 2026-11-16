import { HttpError } from "@/lib/http-error";
import { AdminRequest } from "@/models/admin-request.model";
import { Category } from "@/models/category.model";
import { Comment } from "@/models/comment.model";
import { Course, SaveCourseData } from "@/models/course.model";
import { SendEmailData } from "@/models/email.model";
import { Rating } from "@/models/rating.model";
import { CreateUserData, User } from "@/models/user.model";
import { IAdminRequestRepository } from "@/repositories/interfaces/admin-request-repository.interface";
import { IAuthRepository } from "@/repositories/interfaces/auth-repository.interface";
import { ICategoryRepository } from "@/repositories/interfaces/category-repository.interface";
import { ICommentRepository } from "@/repositories/interfaces/comment-repository.interface";
import { ICourseRepository } from "@/repositories/interfaces/course-repository.interface";
import { IEmailRepository } from "@/repositories/interfaces/email-repository.interface";
import { IRatingRepository } from "@/repositories/interfaces/rating-repository.interface";
import { IStorageRepository } from "@/repositories/interfaces/storage-repository.interface";
import { IUserRepository } from "@/repositories/interfaces/user-repository.interface";
import { AdminRequestService } from "@/services/admin-request.service";
import { CategoryService } from "@/services/category.service";
import { CommentService } from "@/services/comment.service";
import { CourseService } from "@/services/course.service";
import { EmailService } from "@/services/email.service";
import { RatingService } from "@/services/rating.service";
import { UserService } from "@/services/user.service";
import { IAdminRequestService } from "@/services/interfaces/admin-request-service.interface";
import { aluno, admin, outroAdmin, cursoGestao, cursoTecnologia, gestao, tecnologia } from "./fixtures";

export interface TestApp {
  emails: SendEmailData[];
  services: {
    user: UserService;
    category: CategoryService;
    course: CourseService;
    comment: CommentService;
    rating: RatingService;
    email: EmailService;
    adminRequest: IAdminRequestService;
  };
}

const SENHA_VALIDA = "senha1234";

export function createTestApp(): TestApp {
  const users: User[] = [{ ...aluno }, { ...admin }, { ...outroAdmin }];
  const passwords = new Map<string, string>([
    [aluno.email, SENHA_VALIDA],
    [admin.email, SENHA_VALIDA],
    [outroAdmin.email, SENHA_VALIDA],
  ]);
  const categories: Category[] = [{ ...tecnologia }, { ...gestao }];
  const courses: Course[] = [{ ...cursoTecnologia }, { ...cursoGestao }];
  const comments: Comment[] = [];
  const ratings: Rating[] = [];
  const emails: SendEmailData[] = [];
  const images = new Map<string, { body: ArrayBuffer; contentType: string }>();
  let nextUserId = 3;
  let nextCourseId = 12;
  let nextCommentId = 1;
  let nextRatingId = 1;
  let nextAdminRequestId = 1;
  const adminRequests: AdminRequest[] = [];

  const userRepository: IUserRepository = {
    findAll: async () => users.map((user) => ({ ...user })),
    findById: async (id) => users.find((user) => user.id === id) ?? null,
    findByEmail: async (email) => users.find((user) => user.email === email) ?? null,
    updateRole: async (id, role) => {
      const user = users.find((item) => item.id === id);

      if (!user) {
        throw new HttpError("Usuário não encontrado", 404);
      }

      user.role = role;
      return { ...user };
    },
  };

  const toAdminRequest = (request: AdminRequest): AdminRequest => ({ ...request });

  const adminRequestRepository: IAdminRequestRepository = {
    create: async (userId, justificativa) => {
      const user = users.find((item) => item.id === userId)!;
      const now = new Date().toISOString();
      const request: AdminRequest = {
        id: nextAdminRequestId++,
        justificativa,
        status: "PENDENTE",
        userId,
        userName: user.name,
        userEmail: user.email,
        reviewedById: null,
        createdAt: now,
        updatedAt: now,
      };
      adminRequests.push(request);
      return toAdminRequest(request);
    },
    findById: async (id) => adminRequests.find((item) => item.id === id) ?? null,
    findPendingByUserId: async (userId) =>
      adminRequests.find((item) => item.userId === userId && item.status === "PENDENTE") ?? null,
    findLatestByUserId: async (userId) =>
      [...adminRequests].reverse().find((item) => item.userId === userId) ?? null,
    findAll: async () => adminRequests.map(toAdminRequest),
    review: async (id, status, reviewedById) => {
      const request = adminRequests.find((item) => item.id === id)!;
      request.status = status;
      request.reviewedById = reviewedById;
      request.updatedAt = new Date().toISOString();
      return toAdminRequest(request);
    },
  };

  const categoryRepository: ICategoryRepository = {
    findAll: async () => categories.map((category) => ({ ...category })),
    findById: async (id) => categories.find((category) => category.id === id) ?? null,
  };

  const courseRepository: ICourseRepository = {
    findAll: async () => courses.map((course) => ({ ...course })),
    findById: async (id) => courses.find((course) => course.id === id) ?? null,
    findByCategoryId: async (categoryId) => courses.filter((course) => course.categoria_id === categoryId),
    search: async (filters) => {
      const matches = courses.filter((course) => {
        if (filters.nivel && course.nivel !== filters.nivel) {
          return false;
        }
        if (typeof filters.categoriaId === "number" && course.categoria_id !== filters.categoriaId) {
          return false;
        }
        return true;
      });
      return { total: matches.length, courses: matches.slice(0, filters.limite) };
    },
    create: async (data: SaveCourseData) => {
      const category = data.categoria_id
        ? categories.find((item) => item.id === data.categoria_id) ?? null
        : null;
      const course: Course = {
        id: nextCourseId++,
        nome: data.nome,
        descricao: data.descricao,
        cargaHoraria: data.cargaHoraria,
        nivel: data.nivel,
        provider: data.provider,
        url: data.url,
        imagemPath: data.imagemPath ?? null,
        categoria: category,
        categoria_id: category?.id ?? null,
        responsavelIds: [...data.responsavelIds],
      };
      courses.push(course);
      return course;
    },
    update: async (id, data) => {
      const course = courses.find((item) => item.id === id);

      if (!course) {
        throw new HttpError("Curso não encontrado", 404);
      }

      const category = data.categoria_id
        ? categories.find((item) => item.id === data.categoria_id) ?? null
        : null;

      course.nome = data.nome;
      course.descricao = data.descricao;
      course.cargaHoraria = data.cargaHoraria;
      course.nivel = data.nivel;
      course.provider = data.provider;
      course.url = data.url;
      course.imagemPath = data.imagemPath ?? null;
      course.categoria = category;
      course.categoria_id = category?.id ?? null;
      return { ...course };
    },
    delete: async (id) => {
      const index = courses.findIndex((course) => course.id === id);
      if (index >= 0) {
        courses.splice(index, 1);
      }
      for (let i = comments.length - 1; i >= 0; i -= 1) {
        if (comments[i].curso.id === id) {
          comments.splice(i, 1);
        }
      }
      for (let i = ratings.length - 1; i >= 0; i -= 1) {
        if (ratings[i].curso.id === id) {
          ratings.splice(i, 1);
        }
      }
    },
  };

  const commentRepository: ICommentRepository = {
    findById: async (id) => comments.find((comment) => comment.id === id) ?? null,
    findByCourseId: async (courseId) => comments.filter((comment) => comment.curso.id === courseId),
    create: async ({ texto, cursoId, userId }) => {
      const course = courses.find((item) => item.id === cursoId);
      const user = users.find((item) => item.id === userId);
      if (!course || !user) {
        throw new Error("Integridade relacional violada");
      }
      const comment: Comment = {
        id: nextCommentId++,
        texto,
        date: new Date().toISOString(),
        user: { ...user },
        curso: { ...course },
      };
      comments.push(comment);
      return comment;
    },
  };

  const ratingRepository: IRatingRepository = {
    findByCourseId: async (courseId) => ratings.filter((rating) => rating.curso.id === courseId),
    averageByCourseId: async (courseId) => {
      const list = ratings.filter((rating) => rating.curso.id === courseId);
      if (list.length === 0) {
        return null;
      }
      return list.reduce((total, rating) => total + rating.nota, 0) / list.length;
    },
    create: async ({ nota, cursoId, userId }) => {
      const course = courses.find((item) => item.id === cursoId);
      const user = users.find((item) => item.id === userId);
      if (!course || !user) {
        throw new Error("Integridade relacional violada");
      }
      const rating: Rating = {
        id: nextRatingId++,
        nota,
        dataAvaliacao: new Date().toISOString(),
        user: { ...user },
        curso: { ...course },
      };
      ratings.push(rating);
      return rating;
    },
  };

  const storageRepository: IStorageRepository = {
    upload: async (path, file) => {
      images.set(path, { body: await file.arrayBuffer(), contentType: file.type || "application/octet-stream" });
    },
    download: async (path) => images.get(path) ?? null,
    remove: async (path) => {
      images.delete(path);
    },
  };

  const emailRepository: IEmailRepository = {
    send: async (data) => {
      emails.push(data);
    },
  };

  const emailService = new EmailService(emailRepository);

  const authRepository: IAuthRepository = {
    signUp: async (data: CreateUserData) => {
      if (data.password.length < 8) {
        throw new HttpError("A senha deve ter pelo menos 8 caracteres", 400);
      }
      if (users.some((user) => user.email === data.email)) {
        throw new HttpError("E-mail já cadastrado", 422);
      }
      const user: User = {
        id: nextUserId++,
        name: data.name,
        email: data.email,
        role: "ALUNO",
      };
      users.push(user);
      passwords.set(user.email, data.password);
      await emailService.sendVerificationEmail(user, "http://localhost/email-verificado");
      return user;
    },
    signIn: async (email, password) => {
      const user = users.find((item) => item.email === email);
      if (!user || passwords.get(email) !== password) {
        return null;
      }
      return { ...user, token: `token-${user.id}` };
    },
    signOut: async () => undefined,
    getSessionUser: async (headers) => {
      const authorization = headers.get("authorization");
      const id =
        authorization === "Bearer admin"
          ? admin.id
          : authorization === "Bearer aluno"
            ? aluno.id
            : authorization === "Bearer outro-admin"
              ? outroAdmin.id
              : null;

      if (id === null) {
        return null;
      }

      const user = users.find((item) => item.id === id);
      return user ? { ...user } : null;
    },
  };

  return {
    emails,
    services: {
      user: new UserService(userRepository, authRepository),
      category: new CategoryService(categoryRepository, courseRepository),
      course: new CourseService(courseRepository, categoryRepository, storageRepository),
      comment: new CommentService(commentRepository, courseRepository, userRepository),
      rating: new RatingService(ratingRepository, courseRepository, userRepository),
      email: emailService,
      adminRequest: new AdminRequestService(adminRequestRepository, userRepository),
    },
  };
}
