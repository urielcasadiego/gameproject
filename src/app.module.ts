import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { AuthModule } from "./auth/auth.module";
import { ScoreModule } from "./modules/score/score.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import * as path from "path";

@Module({
  imports: [
    AuthModule,
    ScoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, "../.env"),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>("MONGODB_URI");
        return { uri };
      },
      inject: [ConfigService],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      path: `${process.env.API_PREFIX}/graphql`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
