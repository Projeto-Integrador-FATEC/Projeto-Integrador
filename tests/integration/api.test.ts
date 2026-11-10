import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestApp, TestApp } from "../support/app";
import { admin, aluno, cursoGestao, cursoTecnologia } from "../support/fixtures";
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

import { POST as createRating } from "@/app/api/avaliacoes/route";
import { GET as getRatings } from "@/app/api/avaliacoes/curso/[cursoId]/route";
import { GET as getAverage } from "@/app/api/avaliacoes/curso/[cursoId]/media/route";
import { GET as getCategories } from "@/app/api/categorias/route";
import { GET as getCoursesByCategory } from "@/app/api/categorias/categoria/[categoriaId]/route";
import { GET as getComments } from "@/app/api/comentarios/curso/[cursoId]/route";
import { POST as createComment } from "@/app/api/comentarios/route";
import { GET as getCourse } from "@/app/api/cursos/[id]/route";
import { GET as getCourses, POST as createCourse } from "@/app/api/cursos/route";
import { GET as getUserByEmail } from "@/app/api/users/get-user-by-email/[email]/route";
import { GET as getUser } from "@/app/api/users/get-user/[id]/route";
import { POST as login } from "@/app/api/users/login/route";
import { GET as getUsers, POST as createUser } from "@/app/api/users/route";
import { GET as getImage } from "@/app/imagens/[...path]/route";

describe("Integração das rotas HTTP", () => {
  beforeEach(() => {
    doubles.app = createTestApp();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("UC01CT01 cadastra o estudante com perfil ALUNO, envia o e-mail e autentica", async () => {
    const email = "novo.estudante@fatec.sp.gov.br";
    const created = await createUser(
      jsonRequest("http://localhost/api/users", {
        name: "Novo Estudante",
        email,
        password: "senha1234",
      })
    );

    expect(created.status).toBe(200);
    await expect(created.json()).resolves.toMatchObject({ email, role: "ALUNO" });
    expect(doubles.app!.emails).toHaveLength(1);
    expect(doubles.app!.emails[0].to).toBe(email);
    expect(doubles.app!.emails[0].subject).toContain("Confirme seu e-mail");

    const session = await login(jsonRequest("http://localhost/api/users/login", { email, password: "senha1234" }));
    expect(session.status).toBe(200);
    const body = await session.json();
    expect(body).toMatchObject({ email, role: "ALUNO" });
    expect(body.token).toEqual(expect.any(String));
  });

  it("responde 400 no cadastro incompleto e 401 no login inválido", async () => {
    const invalid = await createUser(jsonRequest("http://localhost/api/users", { name: "Ana", email: "", password: "" }));
    expect(invalid.status).toBe(400);

    const denied = await login(
      jsonRequest("http://localhost/api/users/login", { email: aluno.email, password: "errada123" })
    );
    expect(denied.status).toBe(401);
    await expect(denied.json()).resolves.toEqual({ error: "Credenciais inválidas" });
  });

  it("lista e busca usuários", async () => {
    const list = await getUsers();
    expect(list.status).toBe(200);
    await expect(list.json()).resolves.toEqual(expect.arrayContaining([expect.objectContaining({ email: aluno.email })]));

    const byId = await getUser(new Request("http://localhost/api/users/1"), { params: Promise.resolve({ id: "1" }) });
    expect(byId.status).toBe(200);

    const missing = await getUser(new Request("http://localhost/api/users/99"), { params: Promise.resolve({ id: "99" }) });
    expect(missing.status).toBe(404);

    const byEmail = await getUserByEmail(new Request("http://localhost/api/users/email"), {
      params: Promise.resolve({ email: encodeURIComponent(admin.email) }),
    });
    expect(byEmail.status).toBe(200);
    await expect(byEmail.json()).resolves.toMatchObject({ role: "ADMIN" });
  });

  it("UC02CT01 publica comentário, lista pelo curso e rejeita curso inexistente", async () => {
    const created = await createComment(
      jsonRequest("http://localhost/api/comentarios", {
        texto: "Aula muito boa",
        cursoId: 10,
        emailUsuario: aluno.email,
      })
    );
    expect(created.status).toBe(200);
    const comment = await created.json();
    expect(comment.texto).toBe("Aula muito boa");
    expect(comment.curso.id).toBe(10);
    expect(comment.date).toEqual(expect.any(String));

    const list = await getComments(new Request("http://localhost/api/comentarios/curso/10"), {
      params: Promise.resolve({ cursoId: "10" }),
    });
    expect(list.status).toBe(200);
    await expect(list.json()).resolves.toEqual([expect.objectContaining({ id: comment.id, texto: "Aula muito boa" })]);

    const missing = await createComment(
      jsonRequest("http://localhost/api/comentarios", {
        texto: "Não deve gravar",
        cursoId: 9999,
        emailUsuario: aluno.email,
      })
    );
    expect(missing.status).toBe(404);
    await expect(missing.json()).resolves.toEqual({ error: "Curso não encontrado" });

    const after = await getComments(new Request("http://localhost/api/comentarios/curso/10"), {
      params: Promise.resolve({ cursoId: "10" }),
    });
    await expect(after.json()).resolves.toHaveLength(1);
  });

  it("UC03CT01 lista categorias e devolve só os cursos da categoria em menos de 1 segundo", async () => {
    const started = performance.now();
    const categories = await getCategories();
    const courses = await getCourses();
    const filtered = await getCoursesByCategory(new Request("http://localhost/api/categorias/categoria/1"), {
      params: Promise.resolve({ categoriaId: "1" }),
    });
    expect(performance.now() - started).toBeLessThan(1000);

    expect(categories.status).toBe(200);
    await expect(categories.json()).resolves.toEqual([
      { id: 1, nome: "Tecnologia" },
      { id: 2, nome: "Gestão" },
    ]);
    expect(courses.status).toBe(200);
    const body = await filtered.json();
    expect(filtered.status).toBe(200);
    expect(body).toEqual([cursoTecnologia]);
    expect(body).not.toContainEqual(cursoGestao);
  });

  it("protege o cadastro de curso com 401, 403 e 400 e publica com administrador", async () => {
    const payload = {
      nome: "Banco de Dados",
      descricao: "Modelagem relacional introdutória",
      cargaHoraria: 30,
      nivel: "intermediario",
      provider: "Fatec",
      url: "https://example.com/bd",
      categoria_id: 1,
    };

    const anonymous = await createCourse(courseRequest(payload));
    expect(anonymous.status).toBe(401);

    const student = await createCourse(courseRequest(payload, "Bearer aluno"));
    expect(student.status).toBe(403);

    const invalid = await createCourse(courseRequest({ ...payload, nome: "BD" }, "Bearer admin"));
    expect(invalid.status).toBe(400);

    const nivelInvalido = new FormData();
    nivelInvalido.set(
      "curso",
      new File([JSON.stringify({ ...payload, nivel: "expert" })], "curso.json", { type: "application/json" })
    );
    nivelInvalido.set("categoria_id", "1");
    const invalidLevel = await createCourse(
      new Request("http://localhost/api/cursos", {
        method: "POST",
        headers: { authorization: "Bearer admin" },
        body: nivelInvalido,
      })
    );
    expect(invalidLevel.status).toBe(400);
    await expect(invalidLevel.json()).resolves.toEqual({ error: "Nível inválido" });

    const created = await createCourse(courseRequest(payload, "Bearer admin"));
    expect(created.status).toBe(200);
    await expect(created.json()).resolves.toMatchObject({ nome: "Banco de Dados", categoria_id: 1 });

    const found = await getCourse(new Request("http://localhost/api/cursos/10"), {
      params: Promise.resolve({ id: "10" }),
    });
    expect(found.status).toBe(200);
    await expect(found.json()).resolves.toMatchObject({ id: 10, nome: cursoTecnologia.nome });

    const missing = await getCourse(new Request("http://localhost/api/cursos/9999"), {
      params: Promise.resolve({ id: "9999" }),
    });
    expect(missing.status).toBe(404);
  });

  it("responde 400 para corpo inválido e 500 para falha inesperada", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const broken = await createUser(
      new Request("http://localhost/api/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      })
    );
    expect(broken.status).toBe(500);

    const emptyCourse = await createCourse(
      new Request("http://localhost/api/cursos", {
        method: "POST",
        headers: { authorization: "Bearer admin" },
        body: new FormData(),
      })
    );
    expect(emptyCourse.status).toBe(400);

    const form = new FormData();
    form.set("curso", "{");
    const badJson = await createCourse(
      new Request("http://localhost/api/cursos", {
        method: "POST",
        headers: { authorization: "Bearer admin" },
        body: form,
      })
    );
    expect(badJson.status).toBe(400);

    doubles.app!.services.user.getAll = async () => {
      throw new Error("banco indisponível");
    };
    const failed = await getUsers();
    expect(failed.status).toBe(500);
    await expect(failed.json()).resolves.toEqual({ error: "Erro ao buscar usuários" });

    doubles.app!.services.category.getAll = async () => {
      throw new Error("falha");
    };
    expect((await getCategories()).status).toBe(500);

    doubles.app!.services.category.getCoursesByCategory = async () => {
      throw new Error("falha");
    };
    expect(
      (await getCoursesByCategory(new Request("http://localhost/api/categorias/categoria/1"), {
        params: Promise.resolve({ categoriaId: "1" }),
      })).status
    ).toBe(500);

    doubles.app!.services.comment.getByCourseId = async () => {
      throw new Error("falha");
    };
    expect(
      (await getComments(new Request("http://localhost/api/comentarios/curso/10"), {
        params: Promise.resolve({ cursoId: "10" }),
      })).status
    ).toBe(500);

    doubles.app!.services.course.getAll = async () => {
      throw new Error("falha");
    };
    expect((await getCourses()).status).toBe(500);

    doubles.app!.services.rating.getByCourseId = async () => {
      throw new Error("falha");
    };
    expect(
      (await getRatings(new Request("http://localhost/api/avaliacoes/curso/10"), {
        params: Promise.resolve({ cursoId: "10" }),
      })).status
    ).toBe(500);

    doubles.app!.services.rating.getAverageByCourseId = async () => {
      throw new Error("falha");
    };
    expect(
      (await getAverage(new Request("http://localhost/api/avaliacoes/curso/10/media"), {
        params: Promise.resolve({ cursoId: "10" }),
      })).status
    ).toBe(500);

    doubles.app!.services.user.getByEmail = async () => {
      throw new Error("falha");
    };
    expect(
      (await getUserByEmail(new Request("http://localhost/api/users/email"), {
        params: Promise.resolve({ email: "estudante@fatec.sp.gov.br" }),
      })).status
    ).toBe(500);

    doubles.app!.services.user.login = async () => {
      throw new Error("falha");
    };
    expect((await login(jsonRequest("http://localhost/api/users/login", { email: aluno.email, password: "senha1234" }))).status).toBe(500);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("registra avaliação, lista e calcula a média", async () => {
    const created = await createRating(
      jsonRequest("http://localhost/api/avaliacoes", { nota: "8", email: aluno.email, cursoId: "10" })
    );
    expect(created.status).toBe(200);
    await expect(created.json()).resolves.toMatchObject({ nota: 8 });

    const invalid = await createRating(
      jsonRequest("http://localhost/api/avaliacoes", { nota: 0, email: aluno.email, cursoId: 10 })
    );
    expect(invalid.status).toBe(400);

    const list = await getRatings(new Request("http://localhost/api/avaliacoes/curso/10"), {
      params: Promise.resolve({ cursoId: "10" }),
    });
    expect(list.status).toBe(200);
    await expect(list.json()).resolves.toHaveLength(1);

    const average = await getAverage(new Request("http://localhost/api/avaliacoes/curso/10/media"), {
      params: Promise.resolve({ cursoId: "10" }),
    });
    expect(average.status).toBe(200);
    await expect(average.json()).resolves.toBe(8);
  });

  it("entrega a imagem publicada no storage", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "capa.png", { type: "image/png" });
    const form = new FormData();
    form.set(
      "curso",
      JSON.stringify({
        nome: "Curso com capa",
        descricao: "Descrição longa o bastante",
        cargaHoraria: 12,
        nivel: "avancado",
        provider: "Fatec",
        url: "https://example.com/capa",
        categoria_id: 1,
      })
    );
    form.set("imagem", file);

    const created = await createCourse(
      new Request("http://localhost/api/cursos", {
        method: "POST",
        headers: { authorization: "Bearer admin" },
        body: form,
      })
    );
    expect(created.status).toBe(200);
    const course = await created.json();

    const image = await getImage(new Request("http://localhost/imagens/capa"), {
      params: Promise.resolve({ path: [course.imagemPath] }),
    });
    expect(image.status).toBe(200);
    expect(image.headers.get("content-type")).toBe("image/png");

    const missing = await getImage(new Request("http://localhost/imagens/ausente"), {
      params: Promise.resolve({ path: ["ausente.png"] }),
    });
    expect(missing.status).toBe(404);
  });
});

function courseRequest(curso: Record<string, unknown>, authorization?: string) {
  const form = new FormData();
  form.set("curso", JSON.stringify(curso));
  return new Request("http://localhost/api/cursos", {
    method: "POST",
    headers: authorization ? { authorization } : undefined,
    body: form,
  });
}
