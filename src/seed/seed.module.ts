import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ListModule } from 'src/list/list.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  imports:[ItemsModule, UsersModule, ConfigModule, ListModule,ListItemModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
