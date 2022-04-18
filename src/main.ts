import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, document)
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessages = errors.map((error) => Object.values(error.constraints))
        return new BadRequestException(errorMessages.toString())
      },
      forbidUnknownValues: false,
    }),
  )
  await app.listen(process.env.PORT || 8008)
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
