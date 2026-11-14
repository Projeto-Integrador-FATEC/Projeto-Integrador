import { filterCourses } from "@/lib/course-catalog";
import { describe, expect, it } from "vitest";
import { cursoGestao, cursoTecnologia } from "../support/fixtures";

const courses = [cursoTecnologia, cursoGestao];

describe("filterCourses", () => {
  it("mantém somente os cursos da categoria Tecnologia", () => {
    expect(filterCourses(courses, "", 1).map((course) => course.nome)).toEqual(["Lógica de Programação"]);
  });

  it("reduz a lista pelo trecho do nome", () => {
    expect(filterCourses(courses, "gest", null).map((course) => course.id)).toEqual([11]);
  });

  it("combina categoria e busca", () => {
    expect(filterCourses(courses, "lógica", 2)).toEqual([]);
    expect(filterCourses(courses, "lógica", 1)).toEqual([cursoTecnologia]);
  });

  it("filtra milhares de cursos em menos de 1 segundo", () => {
    const catalog = Array.from({ length: 5000 }, (_, index) => ({
      ...cursoTecnologia,
      id: index + 1,
      nome: index % 2 === 0 ? `Tecnologia ${index}` : `Gestão ${index}`,
      categoria_id: index % 2 === 0 ? 1 : 2,
    }));
    const start = performance.now();
    const result = filterCourses(catalog, "tecnologia", 1);
    expect(performance.now() - start).toBeLessThan(1000);
    expect(result.every((course) => course.categoria_id === 1)).toBe(true);
    expect(result.length).toBe(2500);
  });
});
