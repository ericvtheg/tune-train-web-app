import { Module } from '@nestjs/common';
import { FileStorageModule } from "src/common/services/file-storage/file-storage.module";

@Module({
  imports: [FileStorageModule],
})
export class ServicesModule {}