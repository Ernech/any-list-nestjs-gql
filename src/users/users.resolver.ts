import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/calid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from 'src/items/items.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {

  constructor(private readonly usersService: UsersService,
    private readonly itemsService:ItemsService) {}
    
  @Query(() => [User], { name: 'users' })
  async findAll(
    @Args() validRoles:ValidRolesArgs, 
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user:User
  ):Promise<User[]> {
    return await this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string, 
  @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user:User) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput,@CurrentUser([ValidRoles.admin]) user:User) {
    return await this.usersService.update(user, updateUserInput);
  }

  @Mutation(() => User, {name:'blockUser'})
  async blockUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser([ValidRoles.admin]) adminUser:User
  ):Promise<User> {
    return this.usersService.block(id,adminUser);
  }

  @ResolveField(()=> Int, {name:'itemCount'})
  async itemCount(
    @Parent() user:User,
    @CurrentUser([ValidRoles.admin]) adminUser:User
  ):Promise<number>{
    return this.itemsService.itemCountByUser(user);
  }


}
