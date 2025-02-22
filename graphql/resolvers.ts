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
      const cars = await prisma.car.findMany({
        include: {
          car_brand: true,
          principal_brand: true,
          blister_type_car_blister_typeToblister_type: true
        }
      });
      return cars.map((car: any) => ({
        ...car,
        brand: car.car_brand.brand,
        blisterType: car.blister_type_car_blister_typeToblister_type.blister,
        imageUrl: car.image_url,
        isPremium: car.is_premium,
        master_brand: car.principal_brand.brand,
      }));
    },
    car: async (parent: any, { id }: { id: string }) => {
      const car = await prisma.car.findUnique({
        where: { id },
        include: {
          car_brand: true,
          principal_brand: true,
          blister_type_car_blister_typeToblister_type: true
        }
      });

      console.log(car);

      if (car) {
        return {
          ...car,
          brand: car.car_brand.brand,
          blisterType: car.blister_type_car_blister_typeToblister_type?.blister,
          imageUrl: car.image_url,
          isPremium: car.is_premium,
          master_brand: car.principal_brand?.brand
        }
      }
      return null;
    },
    masterBrands: async() => {
      const brands = await prisma.principal_brand.findMany();
      return brands;
    },
    carBrands: async() => {
      const carBrands = await prisma.car_brand.findMany({
        orderBy: {
          brand: 'asc'
        }
      });
      return carBrands;
    },
    blisterType: async() => {
      const blisterTypes = await prisma.blister_type.findMany();
      return blisterTypes;
    }
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
        include: {
          car_brand: true
        }
      });
      return {
        ...car,
        brand: car.car_brand.brand,
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