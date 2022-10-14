import { Module } from "@nestjs/common";
import { ListenResolver } from "src/listen/listen.resolver";
import { ListenService } from "src/listen/listen.service";
import { ListenRepository } from "src/listen/listen.repository";

@Module({
  providers: [ListenResolver, ListenService, ListenRepository]
})
export class ListenModule {}