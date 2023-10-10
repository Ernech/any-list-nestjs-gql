import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignUpInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService:UsersService,
        private readonly jwtService:JwtService,
    ){}

    async signup(signupInput:SignUpInput):Promise<AuthResponse>{
        const user = await this.usersService.create(signupInput);
        const token = await this.jwtService.signAsync({id:user.id});
        return{
            user,
            token
        };;
    }
    
    async login(loginInput:LoginInput):Promise<AuthResponse>{
        
        const user = await this.usersService.findOneByEmail(loginInput.email);
        if(!bcrypt.compareSync(loginInput.password,user.password)){
            throw new BadRequestException('Wrong credentials')
        }
        
        const token = await this.jwtService.signAsync({id:user.id});
        return {
                token,
                user
            };
    }

    async validateUser(id:string):Promise<User>{
        const user = await this.usersService.findOneById(id)
        if(!user.isActive){
            throw new UnauthorizedException('User is not active, talk with the admin')
        }
        delete user.password;
        return user;
    }

    async revalidateToken(user:User):Promise<AuthResponse>{
        const token = await this.jwtService.signAsync({id:user.id});
        return {token, user};
    }

}
