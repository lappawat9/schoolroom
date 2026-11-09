import { INestApplication, ValidationPipe } from "@nestjs/common";
export function configureApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const origins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins,
    methods: ["GET", "POST", "OPTIONS"],
  });
}
