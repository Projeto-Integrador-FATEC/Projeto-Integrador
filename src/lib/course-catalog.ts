import { Course } from "@/models/course.model";

export function filterCourses(
  courses: Course[],
  searchTerm: string,
  categoryId: number | null
): Course[] {
  const term = searchTerm.toLowerCase();

  return courses.filter((course) => {
    const matchesName = course.nome.toLowerCase().includes(term);
    const matchesCategory = categoryId === null || course.categoria_id === categoryId;
    return matchesName && matchesCategory;
  });
}
