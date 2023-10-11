import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports:[TypeOrmModule.forFeature([User],process.env.DB_NAME), ItemsModule],
  providers: [UsersResolver, UsersService],
  exports:[
    //TypeOrmModule, 
    UsersService
  ]
})
export class UsersModule {}
