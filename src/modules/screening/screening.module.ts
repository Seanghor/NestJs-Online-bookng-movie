import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';
import { IsAuthService } from 'src/middlewares/middlewares.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovieService } from '../movie/movie.service';
import { AuditoriumService } from '../auditorium/auditorium.service';
import { GenerateCustomIDService } from 'src/utils/customId';
import { CustomDateTimeService } from 'src/utils/dateTimeCustome.service';




@Module({
  controllers: [ScreeningController],
  providers: [ScreeningService, PrismaService, MovieService, AuditoriumService, GenerateCustomIDService, CustomDateTimeService]
})
export class ScreeningModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      // .forRoutes(ScreeningController)
      .exclude(
        { path: 'screening', method: RequestMethod.GET },
        { path: 'screening/:id', method: RequestMethod.GET }
      )
      .forRoutes(ScreeningController);
  }
}
