import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListResolver {
  constructor(private readonly listService: ListService,
    private readonly listItemService:ListItemService) {}

  @Mutation(() => List)
  createList(@Args('createListInput') createListInput: CreateListInput, 
  @CurrentUser() user:User):Promise<List> {
    return this.listService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll(
    @CurrentUser() user:User,
    @Args() searchArgs:SearchArgs,
    @Args() paginationArgs: PaginationArgs  
  ):Promise<List[]> {
    return this.listService.findAll(user, searchArgs, paginationArgs);
  }

  @Query(() => List, { name: 'list' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user:User):Promise<List> {
    return this.listService.findOne(id,user);
  }

  @Mutation(() => List)
  updateList(@Args('updateListInput') updateListInput: UpdateListInput, @CurrentUser() user:User):Promise<List> {
    return this.listService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List)
  removeList(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, @CurrentUser() user:User):Promise<List> {
    return this.listService.remove(id, user);
  }

  @ResolveField(()=>[ListItem], {name:'items'})
  async getListItems(
    @Parent() list:List, 
    @Args() paginationArgs:PaginationArgs, 
    @Args() searchArgs:SearchArgs
    ):Promise<ListItem[]>{
      return await this.listItemService.findAll(list,paginationArgs,searchArgs);
  }

  @ResolveField(()=>Number,{name:'totalItems'})
  async getListItemsCount(@Parent() list:List):Promise<number>{
    return this.listItemService.getListItemsCount(list);
  }



}
