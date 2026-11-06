import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Rating } from "@/models/rating.model";
import { IRatingRepository } from "./interfaces/rating-repository.interface";
import { courseInclude, toCourse, toUser } from "./mappers";

const ratingInclude = {
  user: true,
  curso: { include: courseInclude },
} satisfies Prisma.AvaliacaoInclude;

type RatingRow = Prisma.AvaliacaoGetPayload<{ include: typeof ratingInclude }>;

function toRating(row: RatingRow): Rating {
  return {
    id: row.id,
    nota: row.nota,
    dataAvaliacao: row.dataAvaliacao,
    user: toUser(row.user),
    curso: toCourse(row.curso),
  };
}

export class RatingRepository implements IRatingRepository {
  async findByCourseId(courseId: number): Promise<Rating[]> {
    const rows = await prisma.avaliacao.findMany({
      where: { cursoId: courseId },
      include: ratingInclude,
      orderBy: { dataAvaliacao: "asc" },
    });
    return rows.map(toRating);
  }

  async averageByCourseId(courseId: number): Promise<number | null> {
    const result = await prisma.avaliacao.aggregate({
      where: { cursoId: courseId },
      _avg: { nota: true },
    });
    return result._avg.nota;
  }

  async create(data: { nota: number; cursoId: number; userId: number }): Promise<Rating> {
    const row = await prisma.avaliacao.create({ data, include: ratingInclude });
    return toRating(row);
  }
}
