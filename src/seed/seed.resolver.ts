import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}


  @Mutation(()=>Boolean,{name:'executeSeed', description:'Execute database construction'})
  async executeSeed():Promise<Boolean>{
    return this.seedService.executeSeed();
  }

}
