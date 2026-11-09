import "reflect-metadata";
import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./configure-app";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT || 3000));
}
bootstrap().catch(() => {
  console.error(
    "Application startup failed. Check database configuration and connectivity.",
  );
  process.exit(1);
});
