import { PrismaService } from './../../prisma/prisma.service';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ExcelController, MovieController } from './movie.controller';
import { HttpExceptionFilter, UnauthorizedExceptionFilter } from 'src/model/http-exception.filter';
import { IsAuthService } from 'src/middlewares/middlewares.service';
import { ExcelService } from 'src/utils/upload-service';
import { GenerateCustomIDService } from 'src/utils/customId';

@Module({
  controllers: [MovieController, ExcelController],
  providers: [GenerateCustomIDService,MovieService,PrismaService, HttpExceptionFilter, UnauthorizedExceptionFilter, IsAuthService, ExcelService],
})
export class MovieModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      // .forRoutes(MovieController, ExcelController) // this is appy all
      .exclude(
        { path: 'movie', method: RequestMethod.GET },
        { path: 'movie/:id', method: RequestMethod.GET }
      )
      .forRoutes(MovieController);
  }
}
