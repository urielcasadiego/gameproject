-- CreateTable
CREATE TABLE "logs" (
    "logId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("logId")
);
