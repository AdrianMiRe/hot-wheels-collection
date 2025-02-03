import {gql} from '@apollo/client';

export const GET_BLISTER = gql`
  query {
    blisterType {
      id
      blister
    }
  }
`;