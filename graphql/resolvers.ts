import prisma from "@/lib/prisma";

interface CarProps {
  id: string
  brand: string
  model: string
  year: number
  color: string
  collection: string
  blisterType: string
  imageUrl: string
  isPremium: boolean
  masterBrand: string
}

// Define resolvers to fetch data using Prisma
export const resolvers = {
  Query: {
    cars: async () => {
      return await prisma.car.findMany();
    },
    car: async (parent: any, { id }: { id: string }) => {
      return await prisma.car.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createCar: async (parent: any, { brand, model, year, color, collection, blisterType, imageUrl, isPremium, masterBrand }: CarProps) => {
      return await prisma.car.create({
        data: {
          brand,
          model,
          year,
          color,
          collection,
          blister_type: blisterType,
          image_url: imageUrl,
          is_premium: isPremium,
          master_brand: masterBrand
        },
      });
    },
    updateCar: async (parent: any, args: CarProps) => {

      const { id, brand, model, year, color, collection, blisterType, imageUrl, isPremium, masterBrand } = args;

      return await prisma.car.update({
        where: { id },
        data: {
          brand,
          model,
          year,
          color,
          collection,
          blister_type: blisterType,
          image_url: imageUrl,
          is_premium: isPremium,
          master_brand: masterBrand
        },
      });
    },
    deleteCar: async (parent: any, args: CarProps) => {
      const { id } = args;
      return await prisma.car.delete({
        where: { id },
      });
    },
  },
};