import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  imports:[ListItemModule,
    TypeOrmModule.forFeature([List],process.env.DB_NAME)],
  providers: [ListResolver, ListService],
  exports:[ListService, TypeOrmModule]
})
export class ListModule {}
