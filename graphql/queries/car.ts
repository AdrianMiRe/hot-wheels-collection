import {gql} from '@apollo/client';

export const GET_CARS = gql`
  query {
    cars {
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