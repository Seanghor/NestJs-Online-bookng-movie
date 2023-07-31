import { PaymentMethodEnum } from "@prisma/client"
import { IsEmpty, IsNotEmpty } from "class-validator"

export class CreatePurchaseDto {
    @IsNotEmpty()
    total: number

    @IsNotEmpty()
    phoneNumber: string

    @IsNotEmpty()
    payMentMethod: PaymentMethodEnum

    @IsEmpty()
    remark: string | null

    @IsNotEmpty()
    bookings: {
        connect: { id: number }[]
    }

}
