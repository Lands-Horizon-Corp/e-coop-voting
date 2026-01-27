import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

let prismaInstance: ReturnType<typeof prismaClientSingleton>;

try {
  prismaInstance = globalThis.prisma ?? prismaClientSingleton();
} catch (error) {
  console.error('Error connecting to the database:', error);
  process.exit(1); 
}

export default prismaInstance

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismaInstance