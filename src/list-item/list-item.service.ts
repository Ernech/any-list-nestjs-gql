import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { List } from 'src/list/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListItemService {

  constructor(
    @InjectRepository(ListItem) private readonly listItemsRepository:Repository<ListItem>
  ){}

  async create(createListItemInput: CreateListItemInput):Promise<ListItem> {
    
    const {itemId,listId,...rest} = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item:{id:itemId},
      list:{id:listId}
    });

    return await this.listItemsRepository.save(newListItem)

  }

  async findAll(list:List, paginationArgs:PaginationArgs, searchArgs:SearchArgs):Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    
    const queryBuilder = this.listItemsRepository.createQueryBuilder('listItem')
    .innerJoin('listItem.item', 'item')
    .take(limit)
    .skip(offset)
    .where('"listId"=:listId',{listId:list.id});

    if(search){
      queryBuilder.andWhere('LOWER(item.name) like:name',{name:`%${search.toLowerCase()}%`})
    }

    return await queryBuilder.getMany();
  }

  async getListItemsCount(list:List):Promise<number>{
    const queryBuilder = this.listItemsRepository.count({
      where: {list:{id:list.id}}
  });

    return await queryBuilder;

  }

  async findOne(id: string):Promise<ListItem> {
    const listItem = this.listItemsRepository.findOneBy({id});
    if(!listItem) throw new NotFoundException(`ListItem with the id ${id} not found`)
    return listItem;
  }

  update(id: number, updateListItemInput: UpdateListItemInput) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
