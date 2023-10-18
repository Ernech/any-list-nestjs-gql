import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListService {

  constructor(@InjectRepository(List) private readonly listRepository:Repository<List>){}

  async create(createListInput: CreateListInput, user:User):Promise<List> {
    const newList =  this.listRepository.create({...createListInput,user});
    return await this.listRepository.save(newList);
  }

 async findAll(user: User, searchArgs:SearchArgs, paginationArgs:PaginationArgs):Promise<List[]> {
  const query = this.listRepository
    .createQueryBuilder('list')
    .select()
    .where('list.userId=:id',{id:user.id})
    .take(paginationArgs.limit)
    .skip(paginationArgs.offset)
    if(searchArgs.search){
      query.andWhere('LOWER(name) LIKE :name',{name:`%${searchArgs.search.toLowerCase()}%`})
    }
    return await query.getMany();
  }

  async findOne(id: string,user:User):Promise<List> {
    const list = await this.listRepository.findOneBy({id, user:{id:user.id}});
    if(!list){
      throw new NotFoundException('List not found');
    }
    return list;
  }

  async update(id: string, updateListInput: UpdateListInput,user:User):Promise<List> {
    await this.findOne(id,user);
    const list = await this.listRepository.preload({...updateListInput, user}); 
    if(!list) throw new NotFoundException('List not found')
    return await this.listRepository.save(list);
  }

  async remove(id: string, user:User):Promise<List> {
    const list = await this.findOne(id,user);
    await this.listRepository.remove(list);
    return {...list,id};
  }

  async getListCount(user:User):Promise<number>{
    const query = this.listRepository
    .createQueryBuilder('list')
    .select()
    .where('list.userId=:id',{id:user.id})
    
    return await query.getCount();

  }

}
