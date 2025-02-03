import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Car {
    id: ID
    brand: ID
    model: String
    year: Int
    color: String
    collection: String
    blister_type: ID
    image_url: String
    is_premium: Boolean
    master_brand: ID
  }

  type MasterBrand {
    id: ID
    brand: String
  }

  type CarBrand {
    id: ID
    brand: String
  }

  type BlisterType {
    id: ID
    blister: String
  }

  type Query {
    cars: [Car]
    car(id: String!): Car
    masterBrands: [MasterBrand]
    carBrands: [CarBrand]
    blisterType: [BlisterType]
  }

  type Mutation {
    createCar(
      brand: String!,
      model: String!,
      year: Int!,
      color: String!,
      collection: String,
      blisterType: String!,
      imageUrl: String!,
      isPremium: Boolean!,
      masterBrand: String!
    ): Car
    updateCar(
      id: String!,
      brand: String!,
      model: String!,
      year: Int!,
      color: String!,
      collection: String,
      blisterType: String!,
      imageUrl: String!,
      isPremium: Boolean!,
      masterBrand: String!
    ): Car
    deleteCar(id: String!): Car
  }
`;