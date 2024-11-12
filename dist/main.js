"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableVersioning().setGlobalPrefix(process.env.API_PREFIX);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.enableCors({
        origin: process.env.URL_ORIGIN,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("API de Scores")
        .setDescription("API para gestionar puntuaciones")
        .setVersion("1.0")
        .addBearerAuth()
        .addTag("scores")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(process.env.PORT);
    console.log("listening on port " + process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map