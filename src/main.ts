import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const setupSwagger = (app: INestApplication) => {
  const options: SwaggerDocumentOptions = {
      deepScanRoutes: true
  };
  const config = new DocumentBuilder()
      .setTitle("UniversityApp API")
      .setDescription("API")
      .setVersion("1.0.0")
      .build()
  const doc = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('/api/docs', app, doc)
}

const corsOptions: CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: [
      'http://localhost',
      'http://tg-mini-app.local',
      'http://tg-webapp.local',
      'https://n0re5.github.io/universityapp/',
      'https://n0re5.github.io/',
      '*'
  ]
}

async function bootstrap() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule, {
      rawBody: true, 
      bodyParser: true,
  })
  setupSwagger(app)
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ 
      transform: true, 
      whitelist: true 
  }));
  app.use((req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    res.setHeader("Access-Control-Max-Age", 7200);
    next();
  })
  app.setGlobalPrefix('/api')
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}
bootstrap();
