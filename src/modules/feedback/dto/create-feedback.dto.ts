import { IsNotEmpty } from "class-validator"

export class CreateFeedbackDto {

    @IsNotEmpty()
    userId: number

    // customId: string

    @IsNotEmpty()
    firstname: string

    @IsNotEmpty()
    lastname: string

    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    feedback: string
}
