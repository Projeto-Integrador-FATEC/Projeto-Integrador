import { CourseService } from "@/services/course.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { admin, outroAdmin, cursoTecnologia, tecnologia } from "../support/fixtures";

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
    search: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
  const categoryRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
  };
  const storageRepository = {
    upload: vi.fn(),
    download: vi.fn(),
    remove: vi.fn(),
  };
  const service = new CourseService(courseRepository, categoryRepository, storageRepository);

  beforeEach(() => {
    vi.clearAllMocks();
    categoryRepository.findById.mockResolvedValue(tecnologia);
    courseRepository.create.mockImplementation(async (data) => ({
      ...cursoTecnologia,
      ...data,
      id: 20,
      responsavelIds: data.responsavelIds,
    }));
    courseRepository.delete.mockResolvedValue(undefined);
    courseRepository.update.mockImplementation(async (id, data) => ({
      ...cursoTecnologia,
      ...data,
      id,
    }));
    storageRepository.remove.mockResolvedValue(undefined);
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
    await expect(service.create(baseData, admin.id)).rejects.toMatchObject({ status: 400, message: "Categoria não encontrada" });
  });

  it("cadastra curso sem imagem e sem categoria", async () => {
    await service.create({ ...baseData, categoria_id: null }, admin.id);
    expect(categoryRepository.findById).not.toHaveBeenCalled();
    expect(storageRepository.upload).not.toHaveBeenCalled();
    expect(courseRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ categoria_id: null, imagemPath: null, responsavelIds: [admin.id] })
    );
  });

  it("envia a capa com o nome sanitizado", async () => {
    const image = new File([new Uint8Array([1, 2, 3])], "Capa Ação Final.PNG", { type: "image/png" });
    await service.create({ ...baseData, image }, admin.id);
    expect(storageRepository.upload).toHaveBeenCalledTimes(1);
    const [path, file] = storageRepository.upload.mock.calls[0];
    expect(path).toMatch(/^\d+_capa-acao-final\.png$/);
    expect(file).toBe(image);
    expect(courseRepository.create).toHaveBeenCalledWith(expect.objectContaining({ imagemPath: path }));
  });

  it("rejeita imagem maior que 10MB", async () => {
    const image = new File([new Uint8Array([1])], "grande.png", { type: "image/png" });
    Object.defineProperty(image, "size", { value: 10 * 1024 * 1024 + 1 });
    await expect(service.create({ ...baseData, image }, admin.id)).rejects.toMatchObject({ status: 400 });
    expect(storageRepository.upload).not.toHaveBeenCalled();
  });

  it("ignora arquivo vazio", async () => {
    const image = new File([], "vazio.png", { type: "image/png" });
    await service.create({ ...baseData, image }, admin.id);
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

  it("exclui o curso quando o admin é responsável", async () => {
    courseRepository.findById.mockResolvedValue({ ...cursoTecnologia, imagemPath: "capa.png" });
    await service.delete(cursoTecnologia.id, admin.id);
    expect(storageRepository.remove).toHaveBeenCalledWith("capa.png");
    expect(courseRepository.delete).toHaveBeenCalledWith(cursoTecnologia.id);
  });

  it("impede a exclusão por admin que não é responsável", async () => {
    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    await expect(service.delete(cursoTecnologia.id, outroAdmin.id)).rejects.toMatchObject({
      status: 403,
      message: "Somente os administradores responsáveis pelo curso podem excluí-lo",
    });
    expect(courseRepository.delete).not.toHaveBeenCalled();
  });

  it("retorna 404 ao excluir curso inexistente", async () => {
    courseRepository.findById.mockResolvedValue(null);
    await expect(service.delete(9999, admin.id)).rejects.toMatchObject({ status: 404, message: "Curso não encontrado" });
  });

  it("atualiza o curso quando o admin é responsável", async () => {
    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    await service.update(cursoTecnologia.id, { ...baseData, nome: "Curso atualizado" }, admin.id);
    expect(courseRepository.update).toHaveBeenCalledWith(
      cursoTecnologia.id,
      expect.objectContaining({ nome: "Curso atualizado", imagemPath: cursoTecnologia.imagemPath })
    );
  });

  it("substitui a capa ao atualizar com nova imagem", async () => {
    courseRepository.findById.mockResolvedValue({ ...cursoTecnologia, imagemPath: "antiga.png" });
    const image = new File([new Uint8Array([1, 2, 3])], "nova.png", { type: "image/png" });
    await service.update(cursoTecnologia.id, { ...baseData, image }, admin.id);
    expect(storageRepository.upload).toHaveBeenCalledTimes(1);
    expect(storageRepository.remove).toHaveBeenCalledWith("antiga.png");
    expect(courseRepository.update).toHaveBeenCalledWith(
      cursoTecnologia.id,
      expect.objectContaining({ imagemPath: expect.stringMatching(/^\d+_nova\.png$/) })
    );
  });

  it("impede a edição por admin que não é responsável", async () => {
    courseRepository.findById.mockResolvedValue(cursoTecnologia);
    await expect(service.update(cursoTecnologia.id, baseData, outroAdmin.id)).rejects.toMatchObject({
      status: 403,
      message: "Somente os administradores responsáveis pelo curso podem editá-lo",
    });
    expect(courseRepository.update).not.toHaveBeenCalled();
  });
});
