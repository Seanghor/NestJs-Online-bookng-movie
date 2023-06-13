import { HttpException, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './modules/movie/movie.module';
import { UserModule } from './modules/user/user.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AuditoriumModule } from './modules/auditorium/auditorium.module';
import { MiddlewaresModule } from './middlewares/middlewares.module';

@Module({
  imports: [AuthModule, PrismaModule, MovieModule, UserModule, TicketModule, AuditoriumModule, MiddlewaresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
