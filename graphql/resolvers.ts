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
      const cars = await prisma.car.findMany();
      return cars.map((car: any) => ({
        ...car,
        blisterType: car.blister_type,
        imageUrl: car.image_url,
        isPremium: car.is_premium,
        master_brand: car.master_brand,
      }));
    },
    car: async (parent: any, { id }: { id: string }) => {
      const car = await prisma.car.findUnique({
        where: { id },
      });

      if (car) {
        return {
          ...car,
          blisterType: car.blister_type,
          imageUrl: car.image_url,
          isPremium: car.is_premium,
          masterBrand: car.master_brand,
        }
      }
      return null;
    },
  },
  Mutation: {
    createCar: async (parent: any, { brand, model, year, color, collection, blisterType, imageUrl, isPremium, masterBrand }: CarProps) => {
      const car = await prisma.car.create({
        data: {
          brand,
          model,
          year,
          color,
          collection,
          blister_type: blisterType,
          image_url: imageUrl,
          is_premium: isPremium,
          master_brand: masterBrand,
        },
      });
      return {
        ...car,
        blisterType: car.blister_type,
        imageUrl: car.image_url,
        isPremium: car.is_premium,
        masterBrand: car.master_brand,
      };
    },
    updateCar: async (parent: any, args: CarProps) => {

      const { id, brand, model, year, color, collection, blisterType, imageUrl, isPremium, masterBrand } = args;

      const car = await prisma.car.update({
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
          master_brand: masterBrand,
        },
      });
      return {
        ...car,
        blisterType: car.blister_type,
        imageUrl: car.image_url,
        isPremium: car.is_premium,
        masterBrand: car.master_brand,
      };
    },
    deleteCar: async (parent: any, { id }: { id: string }) => {
      const car = await prisma.car.delete({
        where: { id },
      });
      return {
        ...car,
        blisterType: car.blister_type,
        imageUrl: car.image_url,
        isPremium: car.is_premium,
        masterBrand: car.master_brand,
      };
    },
  },
};