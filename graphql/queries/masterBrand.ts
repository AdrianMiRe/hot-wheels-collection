import {gql} from '@apollo/client';

export const GET_MASTER_BRANDS = gql`
  query {
    masterBrands {
      id
      brand
    }
  }
`;