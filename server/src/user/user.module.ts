import { Module } from '@nestjs/common';
import { UserResolver } from 'src/user/user.resolver';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { ArtistModule } from 'src/artist/artist.module';
import { ListenModule } from 'src/listen/listen.module';

@Module({
  imports: [ArtistModule, ListenModule],
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
