import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
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

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListResolver {
  constructor(private readonly listService: ListService) {}

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
}
