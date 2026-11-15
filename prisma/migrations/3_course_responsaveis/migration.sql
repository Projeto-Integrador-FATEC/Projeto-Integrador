-- CreateTable
CREATE TABLE "curso_responsaveis" (
    "user_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,

    CONSTRAINT "curso_responsaveis_pkey" PRIMARY KEY ("user_id","curso_id")
);

-- CreateIndex
CREATE INDEX "curso_responsaveis_curso_id_idx" ON "curso_responsaveis"("curso_id");

-- AddForeignKey
ALTER TABLE "curso_responsaveis" ADD CONSTRAINT "curso_responsaveis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curso_responsaveis" ADD CONSTRAINT "curso_responsaveis_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterForeignKey
ALTER TABLE "comentarios" DROP CONSTRAINT "comentarios_curso_id_fkey";
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_curso_id_fkey";
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: admins atuais passam a ser responsáveis pelos cursos já existentes
INSERT INTO "curso_responsaveis" ("user_id", "curso_id")
SELECT u."id", c."id"
FROM "users" u
CROSS JOIN "cursos" c
WHERE u."role" = 'ADMIN'
ON CONFLICT DO NOTHING;
