import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ItemsService } from 'src/items/items.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports:[ItemsService, UsersService],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
