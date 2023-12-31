import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args';
@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item) private readonly itemsRepository:Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput, user:User):Promise<Item> {
    const newItem = this.itemsRepository.create({...createItemInput, user});
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user:User, paginationArgs:PaginationArgs, searchArgs:SearchArgs):Promise<Item[]> {
    
    const {limit, offset} = paginationArgs;
    const { search } = searchArgs;
    const queryBulder= this.itemsRepository.createQueryBuilder('item').select()
    .where('item.userId = :id') //.where('"userId"=:userId',{userId:user.id})
    .setParameters({id:user.id})
    .take(limit)
    .skip(offset)
    
    if(search){
      queryBulder.andWhere('LOWER(name) like :name',{name:`%${search.toLowerCase()}%`});
    }

    return queryBulder.getMany();

    // return await this.itemsRepository.find({
    //   take: limit,
    //   skip:offset,
    //   where:{
    //     user:{
    //       id:user.id
    //     },
    //     name: Like(`%${search}%`)
    //   }
    // });
  }

 async findOne(id: string, user:User):Promise<Item> {
    // const item= await this.itemsRepository.createQueryBuilder('item').select()
    // .where('(item.userId = :id)')
    // .andWhere('(item.id = :itemId)')
    // .setParameters({id:user.id, itemId:id})
    // .getOne();
    const item = await this.itemsRepository.findOneBy({id,user:{id:user.id}})
    if(!item){
      throw new NotFoundException(`The item with the id ${id} doesn't exists`);
    }
   
    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user:User):Promise<Item> {
    await this.findOne(id,user);  
    const item = await this.itemsRepository.preload(updateItemInput);
      if(!item) throw new NotFoundException(`The item with the id ${id} doesn't exists`);
      return await this.itemsRepository.save(item);
  }

  async remove(id: string,user:User):Promise<Item> {
    const item = await this.findOne(id,user);
    await this.itemsRepository.remove(item);
    return {...item,id};
  }

  async itemCountByUser(user:User):Promise<number>{
    return this.itemsRepository.count({
      where:{
        user:{
          id: user.id
        }
      }
    })
  }


}
