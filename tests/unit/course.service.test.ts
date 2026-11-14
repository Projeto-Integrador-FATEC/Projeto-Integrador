import { CourseService } from "@/services/course.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cursoTecnologia, tecnologia } from "../support/fixtures";

const baseData = {
  nome: "Novo curso",
  descricao: "Descrição do novo curso",
  cargaHoraria: 20,
  nivel: "iniciante",
  provider: "Fatec",
  url: "https://example.com/novo",
  categoria_id: tecnologia.id,
};

describe("CourseService", () => {
  const courseRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByCategoryId: vi.fn(),
    create: vi.fn(),
  };
  const categoryRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
  };
  const storageRepository = {
    upload: vi.fn(),
    download: vi.fn(),
  };
  const service = new CourseService(courseRepository, categoryRepository, storageRepository);

  beforeEach(() => {
    vi.clearAllMocks();
    categoryRepository.findById.mockResolvedValue(tecnologia);
    courseRepository.create.mockImplementation(async (data) => ({ ...cursoTecnologia, ...data, id: 20 }));
    storageRepository.upload.mockResolvedValue(undefined);
  });

  it("lista e busca curso por id", async () => {
    courseRepository.findAll.mockResolvedValue([cursoTecnologia]);
    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    await expect(service.getAll()).resolves.toEqual([cursoTecnologia]);
    await expect(service.getById(10)).resolves.toEqual(cursoTecnologia);
  });

  it("retorna 404 quando o curso não existe", async () => {
    courseRepository.findById.mockResolvedValue(null);
    await expect(service.getById(9999)).rejects.toMatchObject({ status: 404, message: "Curso não encontrado" });
  });

  it("rejeita categoria inexistente", async () => {
    categoryRepository.findById.mockResolvedValue(null);
    await expect(service.create(baseData)).rejects.toMatchObject({ status: 400, message: "Categoria não encontrada" });
  });

  it("cadastra curso sem imagem e sem categoria", async () => {
    await service.create({ ...baseData, categoria_id: null });
    expect(categoryRepository.findById).not.toHaveBeenCalled();
    expect(storageRepository.upload).not.toHaveBeenCalled();
    expect(courseRepository.create).toHaveBeenCalledWith(expect.objectContaining({ categoria_id: null, imagemPath: null }));
  });

  it("envia a capa com o nome sanitizado", async () => {
    const image = new File([new Uint8Array([1, 2, 3])], "Capa Ação Final.PNG", { type: "image/png" });
    await service.create({ ...baseData, image });
    expect(storageRepository.upload).toHaveBeenCalledTimes(1);
    const [path, file] = storageRepository.upload.mock.calls[0];
    expect(path).toMatch(/^\d+_capa-acao-final\.png$/);
    expect(file).toBe(image);
    expect(courseRepository.create).toHaveBeenCalledWith(expect.objectContaining({ imagemPath: path }));
  });

  it("rejeita imagem maior que 10MB", async () => {
    const image = new File([new Uint8Array([1])], "grande.png", { type: "image/png" });
    Object.defineProperty(image, "size", { value: 10 * 1024 * 1024 + 1 });
    await expect(service.create({ ...baseData, image })).rejects.toMatchObject({ status: 400 });
    expect(storageRepository.upload).not.toHaveBeenCalled();
  });

  it("ignora arquivo vazio", async () => {
    const image = new File([], "vazio.png", { type: "image/png" });
    await service.create({ ...baseData, image });
    expect(storageRepository.upload).not.toHaveBeenCalled();
  });

  it("baixa a imagem armazenada", async () => {
    const image = { body: new ArrayBuffer(2), contentType: "image/png" };
    storageRepository.download.mockResolvedValue(image);
    await expect(service.getImage("capa.png")).resolves.toEqual(image);
  });

  it("retorna 404 quando a imagem não existe", async () => {
    storageRepository.download.mockResolvedValue(null);
    await expect(service.getImage("ausente.png")).rejects.toMatchObject({ status: 404, message: "Imagem não encontrada" });
  });
});
