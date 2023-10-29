import { MovieService } from './../src/modules/movie/movie.service';
import { CreateAuditoriumDto } from './../src/modules/auditorium/dto/create-auditorium.dto';
// prisma/seed.ts
import { MovieStatusEnum, PrismaClient } from '@prisma/client';
import { JwtService } from 'src/utils/jwt';
import * as  bcrypt from 'bcrypt'
const prisma = new PrismaClient();
// const jwtService = new JwtService().hashPassword; // Create an instance of JwtService

const hashPassword = async (password: string) => {
    const saltRounds = process.env.saltOrRounds || 12; // Number of salt rounds
    const salt = await bcrypt.genSalt(+saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}



async function main() {
    // generate custom seatId:
    function generateSeatId() {
        const labels = [];
        for (let letter = 65; letter <= 90; letter++) {
            const letterChar = String.fromCharCode(letter);
            for (let number = 1; number <= 18; number++) {
                const paddedNumber = number.toString().padStart(2, '0');
                labels.push(`${letterChar}-${paddedNumber}`);
            }
        }
        return labels;
    }
    const seatId = generateSeatId()

    const admin = await prisma.user.createMany({
        data: [
            {
                name: "Hai Seanghor",
                email: "hai.seanghor20@kit.edu.kh",
                password: await hashPassword("password"),
                role: "ADMIN",
                enable: true,
                gender: "MALE"
            },
            {
                name: "Rith Kimsour",
                email: "rithkimsour20@kit.edu.kh",
                password: await hashPassword("password"),
                role: "ADMIN",
                enable: true,
                gender: "FEMALE"
            },
            {
                name: "Avartar Admin",
                email: "admin@avatar.com",
                password: await hashPassword("adm1n12345"),
                role: "ADMIN",
                enable: true,
                gender: "MALE"
            },
            {
                name: "Avartar User",
                email: "user@avatar.com",
                password: await hashPassword("user12345"),
                role: "USER",
                enable: true,
                gender: "MALE"
            }
        ]
    });
    console.table({ admin })

    // 3 address
    const cenimaList = [
        {
            name: "AVATAR CINEPLEX Premium Sihanouk",
            address: "#132,Street Samdach Sothearos , Sangkat Ou Mouy, Sihanouk Ville(Prince Mall)",
            phone: "099999999",
            map: null
        },
        {
            name: "AVATAR CINEPLEX AEON SEN SOK",
            address: "Street 1003, Phnom Penh (Aeon Mall Sen Sok)",
            phone: "09888888",
            map: null
        },
        {
            name: "AVATAR CINEPLEX Kirirom",
            address: "Phum Prek Talong 3, Dangkat Chak Angre Krom, Khan Mean Chey, Kirirom",
            phone: "09777777",
            map: null
        },
    ]
    for (let i = 0; i < cenimaList.length; i++) {
        const cenima = await prisma.campus.create({
            data: {
                name: cenimaList[i].name,
                address: cenimaList[i].address,
                phone: cenimaList[i].phone,
                map: cenimaList[i].map,
            }
        })
        console.table({ cenima })
    }


    // create 3 movie:
    const movieList = [
        {
            title: "The Nun 2",
            tmovieTypeype: "ACTION",
            image: "https://www.majorcineplex.com.kh/load_file/movie/file_20231311021333.jpg",
            trailer: "https://www.youtube.com/embed/pA3KLOAb-I8?autoplay=1&mute=1",
            duration_min: 70,
            rating: 6.4,
            price: 7.5,
            status: "NOW_SHOWING",
            opening_date: "2023-09-20"
        },
        {
            title: "Blue Beetle",
            image: "https://www.majorcineplex.com.kh/load_file/movie/file_20232714042700.jpg",
            trailer: "https://www.youtube.com/embed/pA3KLOAb-I8?autoplay=1&mute=1",
            tmovieTypeype: "ACTION",
            duration_min: 70,
            rating: 6.4,
            price: 7.5,
            status: "NOW_SHOWING",
            opening_date: "2023-09-20"
        },
        {
            title: "Beau Is Afraid",
            image: "https://www.majorcineplex.com.kh/load_file/movie/file_20234413104424.jpg",
            trailer: "https://www.youtube.com/embed/jN4b3qcFEd4?autoplay=1&mute=1",
            tmovieTypeype: "HORROR",
            duration_min: 120,
            rating: 6.4,
            status: "NOW_SHOWING",
            opening_date: "2023-09-23"
        },
    ]

    // create movie
    for (let i = 0; i < movieList.length; i++) {
        const movie = await prisma.movie.create({
            data: {
                title: movieList[i].title,
                image: movieList[i].image,
                trailer: movieList[i].trailer,
                sub_title: 'EN/KH',
                description: "A sequel to record-breaking Korean action film The Roundup.",
                duration_min: 120,
                rating: 6.4,
                price: 7.5,
                opening_date: '2023-09-20T00:00:00.000Z',
                status: movieList[i].status as MovieStatusEnum
            }
        })
        console.table({ movie })
    }


    // create 9 auditorium
    for (let i = 1; i <= 9; i++) {
        const auditorium = await prisma.auditorium.create({
            data: {
                name: `AV-0${i}`,
                // num_seats: i % 2 == 0 ? 150 : 200,
                num_seats: 180,
                isAvailable: true,
                campusId: i <= 3 ? 1 : (4 <= i && i <= 6) ? 2 : 3
            }
        })
        console.table({ auditorium })
    }

    // create 3 screening for movie1 at cenima:
    // for (let i = 1; i < 3; i++) {
    //     const screening = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 1,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T13:10:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })
    //     const screening2 = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 1,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T14:30:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })
    //     const screening3 = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 1,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T16:10:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })

    //     const auditorium = await prisma.auditorium.findUnique({
    //         where: {
    //             id: screening.auditoriumId
    //         }
    //     })
    //     const maxSeat = auditorium.num_seats
    //     for (let j = 1; j <= maxSeat; j++) {
    //         // create seat for screen1
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening.id
    //             }
    //         })

    //         // create seat for screen2
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening2.id
    //             }
    //         })

    //         // create seat for screen3
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening3.id
    //             }
    //         })
    //     }
    //     console.table({ screening })
    // }
    // for (let i = 1; i < 3; i++) {
    //     const screening = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 2,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T13:10:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })
    //     const screening2 = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 2,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T14:30:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })
    //     const screening3 = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 2,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T16:10:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })

    //     const auditorium = await prisma.auditorium.findUnique({
    //         where: {
    //             id: screening.auditoriumId
    //         }
    //     })
    //     const maxSeat = auditorium.num_seats
    //     for (let j = 1; j <= maxSeat; j++) {
    //         // create seat for screen1
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening.id
    //             }
    //         })

    //         // create seat for screen2
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening2.id
    //             }
    //         })

    //         // create seat for screen3
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening3.id
    //             }
    //         })
    //     }
    //     console.table({ screening })
    // }
    // for (let i = 1; i < 3; i++) {
    //     const screening = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 3,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T13:10:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })
    //     const screening2 = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 3,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T14:30:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })
    //     const screening3 = await prisma.screening.create({
    //         data: {
    //             movieId: i,
    //             auditoriumId: i,
    //             campusId: 3,
    //             date_show: "2023-07-30T00:00:00.000Z",
    //             duration_min: 70,
    //             startTime: "1970-01-01T16:10:00.000Z",
    //             endTime: "1970-01-01T14:20:00.000Z",
    //             status: "COMING_SOON",
    //             isAvailable: true,
    //         }
    //     })

    //     const auditorium = await prisma.auditorium.findUnique({
    //         where: {
    //             id: screening.auditoriumId
    //         }
    //     })
    //     const maxSeat = auditorium.num_seats
    //     for (let j = 1; j <= maxSeat; j++) {
    //         // create seat for screen1
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening.id
    //             }
    //         })

    //         // create seat for screen2
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening2.id
    //             }
    //         })

    //         // create seat for screen3
    //         await prisma.seat.create({
    //             data: {
    //                 // customId: i == 1 ? `A-${j}` : i == 2 ? `B-${j}` : `C-${j}`,
    //                 customId: seatId[j - 1],
    //                 auditoriumId: auditorium.id,
    //                 screeningId: screening3.id
    //             }
    //         })
    //     }
    //     console.table({ screening })
    // }

    return admin
}




main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });