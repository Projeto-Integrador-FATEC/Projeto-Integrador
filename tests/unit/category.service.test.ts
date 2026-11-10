import { CategoryService } from "@/services/category.service";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cursoTecnologia, tecnologia } from "../support/fixtures";

describe("CategoryService", () => {
  const categoryRepository = { findAll: vi.fn(), findById: vi.fn() };
  const courseRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByCategoryId: vi.fn(),
    create: vi.fn(),
  };
  const service = new CategoryService(categoryRepository, courseRepository);

  beforeEach(() => vi.clearAllMocks());

  it("lista categorias e busca por id", async () => {
    categoryRepository.findAll.mockResolvedValue([tecnologia]);
    categoryRepository.findById.mockResolvedValue(tecnologia);
    await expect(service.getAll()).resolves.toEqual([tecnologia]);
    await expect(service.getById(1)).resolves.toEqual(tecnologia);
  });

  it("retorna 404 quando a categoria não existe", async () => {
    categoryRepository.findById.mockResolvedValue(null);
    await expect(service.getById(99)).rejects.toMatchObject({ status: 404, message: "Categoria não encontrada" });
  });

  it("lista somente os cursos da categoria", async () => {
    courseRepository.findByCategoryId.mockResolvedValue([cursoTecnologia]);
    await expect(service.getCoursesByCategory(1)).resolves.toEqual([cursoTecnologia]);
    expect(courseRepository.findByCategoryId).toHaveBeenCalledWith(1);
  });
});
