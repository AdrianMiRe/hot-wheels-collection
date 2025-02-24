import {gql} from '@apollo/client';

export const GET_CARS = gql`
  query GetCars(
    $brands: [String]
  ) {
    cars (brands: $brands) {
      id
      brand
      model
      year
      image_url
      is_premium
      collection
      master_brand
    }
  }
`;