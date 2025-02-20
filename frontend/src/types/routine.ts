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
  routineId: number
  routineName: string
  totalTime: number
}

export interface RoutineDetailInfo {
  routineName: string
  playList: Play[]
}

export interface Play {
  playId: number
  playName: string
  spendTime: number
}

export interface CreatePlay {
  playName: string
  spendTime: number
}

export interface RoutineCreate {
  routineName: string
  playList: CreatePlay[]
}

export interface NowRoutine {
  routineId: number
  routineStartTime: string
}
