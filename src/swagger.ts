import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Schoolroom API")
    .setDescription(
      "API จัดการนักเรียนและห้องเรียน เลือก id คำนำหน้า เพศ ระดับชั้น และครูจาก GET /api/lookups ก่อนทดสอบ",
    )
    .setVersion("1.0")
    .build();

  SwaggerModule.setup(
    "api/docs",
    app,
    () => SwaggerModule.createDocument(app, config),
    {
      jsonDocumentUrl: "api/docs-json",
      customSiteTitle: "Schoolroom API Docs",
      swaggerOptions: {
        docExpansion: "none",
        displayRequestDuration: true,
        defaultModelsExpandDepth: -1,
      },
    },
  );
}
