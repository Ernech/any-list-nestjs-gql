import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {

  @Field(()=>String)
    @IsEmail()
    email:string;

    @Field(()=>String) 
    @IsNotEmpty()
    @IsString()
    fullName:string;

    @Field(()=>String)
    @IsString()
    @MinLength(6)
    password:string;

}
