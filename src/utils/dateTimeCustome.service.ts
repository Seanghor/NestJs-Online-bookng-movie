import { Injectable } from '@nestjs/common'

@Injectable()
export class CustomDateTimeService {

    generateFuture7Days(dateString: string) {
        const inputDate = new Date(dateString);

        // Initialize an array to store the 7 dates
        const sevenDaysArray = [];

        // Loop to add 7 dates to the array
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(inputDate);
            currentDate.setDate(currentDate.getDate() + i);
            const currentDateStr = currentDate.toISOString().slice(0, 10);
            sevenDaysArray.push(currentDateStr);
        }

        return sevenDaysArray
    }

}





