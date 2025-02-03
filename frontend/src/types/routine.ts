export interface Routines {
    content: Routine[]
    pageable: string
    size: number
    number: number
    sort: {
        empty: boolean
        sorted: boolean
        unsorted: boolean
    }
    numberOfElements: number
    first: boolean
    last: boolean
    empty: boolean
}

export interface Routine {
    id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
}
