import {gql} from '@apollo/client';

export const GET_BRANDS = gql`
  query {
    carBrands {
      id
      brand
    }
  }
`;