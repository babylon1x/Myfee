-- CreateTable
CREATE TABLE "SchoolRequest" (
    "id" TEXT NOT NULL,
    "schoolName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolRequest_pkey" PRIMARY KEY ("id")
);

