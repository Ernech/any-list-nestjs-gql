import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LIST, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';
import { List } from 'src/list/entities/list.entity';
import { ListService } from 'src/list/list.service';

@Injectable()
export class SeedService {

    private isProd:boolean;

    constructor(
        private readonly configService:ConfigService,
        private readonly usersService:UsersService,
        private readonly itemsService:ItemsService,
        private readonly listItemService:ListItemService,
        private readonly listService:ListService,

        @InjectRepository(Item) private readonly itemsRepository:Repository<Item>,
        @InjectRepository(User) private readonly usersRepository:Repository<User>,
        @InjectRepository(ListItem) private readonly listItemRepository:Repository<ListItem>,
        @InjectRepository(List) private readonly listRepository:Repository<List>
        ){
        this.isProd = this.configService.get('STATE') === 'prod'
    }

    async executeSeed():Promise<Boolean>{
        if(this.isProd){
            throw new UnauthorizedException('Cannot run seed on prod');
        }
        await this.deleteDatabase();
        const users = await this.loadUsers();
        await this.loadItems(users);

       const lists = await this.loadLists(users);
       let randomUser:User = users[Math.floor(Math.random() * users.length)];
        const items = await this.itemsService.findAll(randomUser,{limit:15,offset:0},{})
        await this.loadListItems(lists[0],items)
        return true;
    }

    async deleteDatabase(){
        //Delete list items

        await this.listItemRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

        //Delete list
        await this.listRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();

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

    async loadLists(usersArray:User[]):Promise<List[]>{
        const lists = [];
        for(const list of SEED_LIST){
            let randomUser:User = usersArray[Math.floor(Math.random() * usersArray.length)];
            lists.push(await this.listService.create(list, randomUser))
        }
        return lists;
    }

    async loadListItems(list:List, items:Item[]){
        for (const item of items) {
            this.listItemService.create({
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random() * 1)  === 0 ? false:true,
                listId: list.id,
                itemId: item.id
            })
            
        }
    }


}
