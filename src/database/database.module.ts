import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from '../config/envs.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envs.database.url,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
