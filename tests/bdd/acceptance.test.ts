import { filterCourses } from "@/lib/course-catalog";
import { beforeEach, expect, vi } from "vitest";
import { createTestApp, TestApp } from "../support/app";
import { cursoGestao, cursoTecnologia } from "../support/fixtures";
import { runFeature, StepDefinition } from "../support/gherkin";
import { jsonRequest } from "../support/http";

const doubles = vi.hoisted(() => ({
  app: null as TestApp | null,
}));

vi.mock("@/services/modules", () => ({
  get modules() {
    return {
      get services() {
        return doubles.app!.services;
      },
    };
  },
}));

import { GET as getCategories } from "@/app/api/categorias/route";
import { GET as getComments } from "@/app/api/comentarios/curso/[cursoId]/route";
import { POST as createComment } from "@/app/api/comentarios/route";
import { GET as getCourses } from "@/app/api/cursos/route";
import { POST as login } from "@/app/api/users/login/route";
import { POST as createUser } from "@/app/api/users/route";

beforeEach(() => {
  doubles.app = createTestApp();
});

const steps: StepDefinition[] = [
  {
    pattern: /^que o e-mail "(.+)" não está cadastrado$/,
    handler: async (match) => {
      const user = await doubles.app!.services.user.getByEmail(match[1]).catch(() => null);
      expect(user).toBeNull();
    },
  },
  {
    pattern: /^o estudante "(.+)" se cadastra com o e-mail "(.+)" e a senha "(.+)"$/,
    handler: async (match, context) => {
      context.response = await createUser(
        jsonRequest("http://localhost/api/users", { name: match[1], email: match[2], password: match[3] })
      );
    },
  },
  {
    pattern: /^a API responde (\d+) com o perfil "(.+)"$/,
    handler: async (match, context) => {
      const response = context.response as Response;
      expect(response.status).toBe(Number(match[1]));
      context.user = await response.json();
      expect(context.user).toMatchObject({ role: match[2] });
    },
  },
  {
    pattern: /^um e-mail de verificação é enviado para "(.+)"$/,
    handler: (match) => {
      expect(doubles.app!.emails.some((email) => email.to === match[1] && email.text.includes("/email-verificado"))).toBe(true);
    },
  },
  {
    pattern: /^o estudante faz login com o e-mail "(.+)" e a senha "(.+)"$/,
    handler: async (match, context) => {
      context.response = await login(jsonRequest("http://localhost/api/users/login", { email: match[1], password: match[2] }));
    },
  },
  {
    pattern: /^a API responde 200 com os dados do usuário e o token de sessão$/,
    handler: async (_match, context) => {
      const response = context.response as Response;
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.email).toBe((context.user as { email: string }).email);
      expect(body.token).toEqual(expect.any(String));
    },
  },
  {
    pattern: /^que existe o usuário "(.+)" e o curso (\d+)$/,
    handler: async (match) => {
      await expect(doubles.app!.services.user.getByEmail(match[1])).resolves.toMatchObject({ email: match[1] });
      await expect(doubles.app!.services.course.getById(Number(match[2]))).resolves.toMatchObject({ id: Number(match[2]) });
    },
  },
  {
    pattern: /^é enviado POST \/api\/comentarios com o texto "(.+)" para o curso (\d+) e o e-mail "(.+)"$/,
    handler: async (match, context) => {
      context.response = await createComment(
        jsonRequest("http://localhost/api/comentarios", {
          texto: match[1],
          cursoId: Number(match[2]),
          emailUsuario: match[3],
        })
      );
      context.commentText = match[1];
      context.courseId = Number(match[2]);
    },
  },
  {
    pattern: /^o comentário é persistido com a data atual$/,
    handler: async (_match, context) => {
      const response = context.response as Response;
      expect(response.status).toBe(200);
      const comment = await response.json();
      expect(comment.texto).toBe(context.commentText);
      expect(Number.isNaN(Date.parse(comment.date))).toBe(false);
      context.commentId = comment.id;
    },
  },
  {
    pattern: /^é enviado GET \/api\/comentarios\/curso\/(\d+)$/,
    handler: async (match, context) => {
      context.response = await getComments(new Request(`http://localhost/api/comentarios/curso/${match[1]}`), {
        params: Promise.resolve({ cursoId: match[1] }),
      });
      context.courseId = Number(match[1]);
    },
  },
  {
    pattern: /^a API responde 200 com a lista contendo "(.+)"$/,
    handler: async (match, context) => {
      const response = context.response as Response;
      expect(response.status).toBe(200);
      const comments = await response.json();
      expect(comments).toEqual(expect.arrayContaining([expect.objectContaining({ texto: match[1] })]));
    },
  },
  {
    pattern: /^a API responde (\d+) com a mensagem "(.+)"$/,
    handler: async (match, context) => {
      const response = context.response as Response;
      expect(response.status).toBe(Number(match[1]));
      await expect(response.json()).resolves.toEqual({ error: match[2] });
    },
  },
  {
    pattern: /^o comentário do curso inexistente não é persistido$/,
    handler: async () => {
      const comments = await doubles.app!.services.comment.getByCourseId(10);
      expect(comments.every((comment) => comment.texto !== "Não gravar")).toBe(true);
    },
  },
  {
    pattern: /^que existem cursos nas categorias "Tecnologia" e "Gestão"$/,
    handler: async (_match, context) => {
      const categories = await doubles.app!.services.category.getAll();
      expect(categories.map((category) => category.nome)).toEqual(expect.arrayContaining(["Tecnologia", "Gestão"]));
      context.catalog = await doubles.app!.services.course.getAll();
    },
  },
  {
    pattern: /^a aplicação consulta GET \/api\/categorias$/,
    handler: async (_match, context) => {
      const started = performance.now();
      const response = await getCategories();
      context.categoriesMs = performance.now() - started;
      expect(response.status).toBe(200);
      context.categories = await response.json();
    },
  },
  {
    pattern: /^o filtro da categoria "(.+)" é aplicado$/,
    handler: async (match, context) => {
      const categories = context.categories as { id: number; nome: string }[];
      const category = categories.find((item) => item.nome === match[1]);
      expect(category).toBeTruthy();
      context.filtered = filterCourses(context.catalog as typeof cursoTecnologia[], "", category!.id);
      context.categoryId = category!.id;
    },
  },
  {
    pattern: /^a lista contém somente cursos dessa categoria$/,
    handler: (_match, context) => {
      const filtered = context.filtered as typeof cursoTecnologia[];
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((course) => course.categoria_id === context.categoryId)).toBe(true);
      expect(filtered).not.toContainEqual(cursoGestao);
    },
  },
  {
    pattern: /^o termo "(.+)" é digitado na busca$/,
    handler: (match, context) => {
      context.term = match[1];
      context.filtered = filterCourses(context.catalog as typeof cursoTecnologia[], match[1], null);
    },
  },
  {
    pattern: /^a lista fica restrita aos cursos cujo nome contém o termo$/,
    handler: (_match, context) => {
      const term = String(context.term).toLowerCase();
      const filtered = context.filtered as typeof cursoTecnologia[];
      expect(filtered).toEqual([cursoGestao]);
      expect(filtered.every((course) => course.nome.toLowerCase().includes(term))).toBe(true);
    },
  },
  {
    pattern: /^o tempo de resposta do endpoint de cursos é inferior a 1 segundo$/,
    handler: async (_match, context) => {
      const started = performance.now();
      const response = await getCourses();
      const elapsed = performance.now() - started + Number(context.categoriesMs ?? 0);
      expect(response.status).toBe(200);
      expect(elapsed).toBeLessThan(1000);
      await expect(response.json()).resolves.toEqual(expect.arrayContaining([cursoTecnologia, cursoGestao]));
    },
  },
];

runFeature("tests/features/uc01-cadastro-autenticacao.feature", steps);
runFeature("tests/features/uc02-comentario.feature", steps);
runFeature("tests/features/uc03-busca-categoria.feature", steps);
