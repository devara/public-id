import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AvailableConfigType } from 'src/config/config.type';

export default function swaggerSetup(
  app: INestApplication,
  config: ConfigService<AvailableConfigType>,
) {
  const {
    name: appName,
    url: appUrl,
    version: appVersion,
  } = config.getOrThrow('app', {
    infer: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle(appName)
    .setDescription('Example API Description')
    .setVersion(appVersion)
    .addServer(appUrl, 'Development')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);
}
