import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [SongsModule, UsersModule, TypeOrmModule.forRoot(), ArtistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
