-- CreateTable
CREATE TABLE "agent_conversations" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "history_json" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agent_conversations_user_id_idx" ON "agent_conversations"("user_id");

-- AddForeignKey
ALTER TABLE "agent_conversations" ADD CONSTRAINT "agent_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

