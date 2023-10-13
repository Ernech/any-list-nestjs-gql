import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[ItemsModule, UsersModule, ConfigModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
