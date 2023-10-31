import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

// import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors());
  app.use((req, res, next) => {
    if (req.url === '/') {
      res.json({ status: 'API is running on /api' });
      console.log(`API is running on /api`);
    }
    next();
  });
  app.use((req, res, next) => {
    if (req.url === '/api/docs') {
      res.json({ status: `the API documentation is available on /api-docs` });
      console.log(`the API documentation is available on /api-docs`);
    }
    next();
  });



  // Set the global prefix to 'api'
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}
bootstrap();
