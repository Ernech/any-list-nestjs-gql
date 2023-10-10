import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/calid-roles.enum';


@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}


  @Mutation(()=>AuthResponse,{name:'signup'})
  async signUp(
    @Args('signupInput') signupInput:SignUpInput
  ):Promise<AuthResponse>{
    return await this.authService.signup(signupInput);
  }

  @Mutation(()=>AuthResponse,{name:'login'})
  async login(@Args('loginInput') loginInput:LoginInput):Promise<AuthResponse>{
     return await this.authService.login(loginInput);
  }

  @Query(()=> AuthResponse, {name:'revalidate'})
  @UseGuards(JwtAuthGuard)
  async revalidateToken(@CurrentUser([ValidRoles.user]) user:User ):Promise<AuthResponse>{
    return this.authService.revalidateToken(user)
  }
}
