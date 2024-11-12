import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning().setGlobalPrefix(process.env.API_PREFIX);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: process.env.URL_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("API de Scores")
    .setDescription("API para gestionar puntuaciones")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("scores")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT);
  console.log("listening on port " + process.env.PORT);
}
bootstrap();
