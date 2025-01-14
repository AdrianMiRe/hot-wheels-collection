import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Car {
    id: ID
    brand: String
    model: String
    year: Int
    color: String
    collection: String
    blister_type: String
    image_url: String
    is_premium: Boolean
    master_brand: String
  }

  type Query {
    cars: [Car]
    car(id: String!): Car
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