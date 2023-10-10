import { BadRequestException, NotFoundException,Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpInput } from 'src/auth/dto/inputs/signup.dto';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/calid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {

  private logger:Logger = new Logger()

  constructor(
    @InjectRepository(User)
    private readonly usersRepository:Repository<User>){}

  async create(signupInput:SignUpInput):Promise<User>{
    try {
        const newUser = this.usersRepository.create({
          ...signupInput,
          password: bcrypt.hashSync(signupInput.password,10)
        });
        return await this.usersRepository.save(newUser)

    } catch (error) {
     this.handleDBErrors(error);
    }
  }

  private handleDBErrors(error:any):never{
    if(error.code==='23505'){
      throw new BadRequestException(error.detail.replace('key',''));
    }
    if(error.code==='error-001'){
      throw new BadRequestException(error.detail.replace('key',''));
    }

    this.logger.error(error)

    throw new InternalServerErrorException('Please check server logs')
  }

  async findAll(roles:ValidRoles[]):Promise<User[]> {
    if(roles.length===0){
      return await this.usersRepository.find({
        // relations:{
        //   lastUpdatedBy:true
        // }
      });
    }
    return this.usersRepository.createQueryBuilder()
    .where('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles)
    //.andWhere('isActive=:active',{active:true})
    .getMany();

  }

  async findOne(id: string) {
    return await this.findOneById(id)
  }

  
  async findOneByEmail(email: string) {
   try {
      const user = await this.usersRepository.findOneByOrFail({email, isActive:true});
      return user;
   } catch (error) {
    // this.handleDBErrors({
    //   code:'error-001',
    //   detail:`${email} not found`

    // });
    throw new NotFoundException(`${email} not found`)
   }

   
}

async update(user:User, updateUserInput:UpdateUserInput):Promise<User>{
  try {
    const userToUpdate = await this.usersRepository.preload({
      ...updateUserInput,
      password:bcrypt.hashSync(updateUserInput.password,10)});
    userToUpdate.lastUpdatedBy= user;
    return await this.usersRepository.save(userToUpdate);
  } catch (error) {
    console.log(error);
  }
}

async findOneById(id: string) {
  try {
     const user = await this.usersRepository.findOneByOrFail({id});
     return user;
  } catch (error) {
   throw new NotFoundException(`${id} not found`)
  }


}
  async block(id: string, user:User):Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdatedBy=user;
    return await this.usersRepository.save(userToBlock); 
  }
}
