import { ScreeningStatusEnum } from "@prisma/client"

export class Campus_inClude_Screening_Entity {
    id: number
    name: string
    address: string | null
    phone: string | null
    map: string | null
    group: {
        movieId: number
        screening: {
            id: number
            campusId: number
            movieId: number
            auditoruimId: number
            date_show: Date
            duration_min: number
            startDate: Date
            endDate: Date
            status: ScreeningStatusEnum
            isAvailable: boolean
        }[]
    }[]
}
