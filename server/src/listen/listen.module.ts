import { Module, forwardRef } from "@nestjs/common";
import { ListenConsumer } from "src/listen/listen.consumer";
import { ListenResolver } from "src/listen/listen.resolver";
import { ListenService } from "src/listen/listen.service";
import { ListenRepository } from "src/listen/listen.repository";
import { ArtistModule } from "src/artist/artist.module";
import { SongModule } from "src/song/song.module";
import { UserModule } from "src/user/user.module";
import { QueueModule } from "src/common/services/queue/queue.module";

@Module({
  imports: [
    forwardRef(() => ArtistModule), 
    forwardRef(() => SongModule), 
    forwardRef(() => UserModule),
    QueueModule.register(""),
  ],
  providers: [
    ListenResolver, 
    ListenService, 
    ListenRepository,
    ListenConsumer,
  ],
  exports: [ListenService]
})
export class ListenModule {}