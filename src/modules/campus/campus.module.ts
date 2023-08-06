import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CampusService } from './campus.service';
import { CampusController } from './campus.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { IsAuthService } from 'src/middlewares/middlewares.service';

@Module({
  controllers: [CampusController],
  providers: [CampusService, PrismaService, IsAuthService]
})
export class CampusModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthService)
      // .forRoutes(CampusController)
      .exclude(
        { path: 'campus', method: RequestMethod.GET },
        { path: 'campus/:id', method: RequestMethod.GET },
      )
      .forRoutes(CampusController);
  }
}
