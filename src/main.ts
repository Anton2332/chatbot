import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validator initialization
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // Api documentation config
  const config = new DocumentBuilder()
    .setTitle('Nest')
    .setDescription('The nest js API description')
    .setVersion('1.0')
    .addTag('nest')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(bodyParser.json({ limit: '10mb' }));

  app.enableCors({ credentials: true, origin: [process.env.FRONTEND_URL] });

  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

  app.use(
    session({
      cookie: {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== 'dev',
        sameSite: 'lax'
      },
      secret: process.env.SECRET_COOKIE,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(cookieParser());

  await app.listen(+process.env.PORT || 5000);
}

bootstrap();
