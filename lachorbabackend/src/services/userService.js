import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({ where: { email } });
};

const updateUser = async (email, data) => {
  return await prisma.user.update({
    where: { email },
    data,
  });
};

export { getAllUsers, getUserByEmail, updateUser };
