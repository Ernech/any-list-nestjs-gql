import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {

    private isProd:boolean;

    constructor(
        private readonly configService:ConfigService,
        private readonly usersService:UsersService,
        private readonly itemsService:ItemsService,

        @InjectRepository(Item) private readonly itemsRepository:Repository<Item>,
        @InjectRepository(User) private readonly usersRepository:Repository<User>,

        ){
        this.isProd = configService.get('STATE') === 'prod'
    }

    async executeSeed():Promise<Boolean>{
        if(this.isProd){
            throw new UnauthorizedException('Cannot run seed on prod');
        }
        await this.deleteDatabase();
        const users = await this.loadUsers();
        await this.loadItems(users);
        return true;
    }

    async deleteDatabase(){
        //Delete Items
        await this.itemsRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

        await this.usersRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
    }

    async loadUsers():Promise<User[]>{

        const users=[]
        for (const user of SEED_USERS){
            users.push(await this.usersService.create(user));
        }

        return users;

    }

    async loadItems(usersArray:User[]):Promise<void>{

        for(const item of SEED_ITEMS){
            let randomUser:User = usersArray[Math.floor(Math.random() * usersArray.length)];
            await this.itemsService.create(item,randomUser)
        }


    }

}
