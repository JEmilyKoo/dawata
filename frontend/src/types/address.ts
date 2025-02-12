export interface AddressCreate {
  addressName: string
  roadAddress: string
  latitude: number
  longitude: number
  isPrimary: boolean
}

export interface Address {
  id?: number
  addressId?: number
  addressName: string
  roadAddress: string
  latitude: number
  longitude: number
  isPrimary: boolean
}

export interface Coord {
  address_name: string
  x: string
  y: string
}

export interface SearchByKeywordProps {
  query: string
  category_group_code: string
  x: string
  y: string
  radius: number
  rect?: string
  page?: number
  size?: number
  sort?: string
}

export interface SearchByCategoryProps {
  category_group_code: string
  x: string
  y: string
  radius: number
  rect?: string
  page?: number
  size?: number
  sort?: string
}
