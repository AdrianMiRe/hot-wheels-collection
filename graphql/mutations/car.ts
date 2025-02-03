import {gql} from '@apollo/client'

export const SAVE_CAR = gql`
  mutation CreateCar(
    $brand: String!,
    $model: String!,
    $year: Int!,
    $color: String!,
    $blisterType: String!,
    $imageUrl: String!,
    $isPremium: Boolean!,
    $collection: String,
    $masterBrand: String!
  ) {
  createCar(
    brand: $brand,
    model: $model,
    year: $year,
    color: $color,
    blisterType: $blisterType,
    imageUrl: $imageUrl,
    isPremium: $isPremium,
    collection: $collection,
    masterBrand: $masterBrand
  ) {
    brand
    model
    year  
  }
}
`