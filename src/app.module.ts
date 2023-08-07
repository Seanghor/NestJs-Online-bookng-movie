import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './modules/movie/movie.module';
import { UserModule } from './modules/user/user.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { AuditoriumModule } from './modules/auditorium/auditorium.module';
import { MiddlewaresModule } from './middlewares/middlewares.module';
// import { isAuthMiddleware } from './middlewares/middlewares.service';
import { CampusModule } from './modules/campus/campus.module';
import { ScreeningModule } from './modules/screening/screening.module';
import { BookingModule } from './modules/booking/booking.module';
import { SeatModule } from './modules/seat/seat.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', '..', 'client'),
    // }),
    AuthModule, FeedbackModule, PrismaModule, MovieModule, UserModule, TicketModule, AuditoriumModule, MiddlewaresModule, CampusModule, ScreeningModule, BookingModule, SeatModule, PurchaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(isAuthMiddleware)
  //     .exclude('/login')
  //     .forRoutes('*');
  // }
}