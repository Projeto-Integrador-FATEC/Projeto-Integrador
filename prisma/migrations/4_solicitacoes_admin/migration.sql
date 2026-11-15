-- CreateTable
CREATE TABLE "solicitacoes_admin" (
    "id" SERIAL NOT NULL,
    "justificativa" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "user_id" INTEGER NOT NULL,
    "reviewed_by_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacoes_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solicitacoes_admin_user_id_idx" ON "solicitacoes_admin"("user_id");

-- CreateIndex
CREATE INDEX "solicitacoes_admin_status_idx" ON "solicitacoes_admin"("status");

-- AddForeignKey
ALTER TABLE "solicitacoes_admin" ADD CONSTRAINT "solicitacoes_admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_admin" ADD CONSTRAINT "solicitacoes_admin_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
