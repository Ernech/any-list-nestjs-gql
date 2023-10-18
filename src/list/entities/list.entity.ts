import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({name:'list'})
export class List {

  @PrimaryGeneratedColumn('uuid')
  @Field(()=>String)
  id:string;

  @Column()
  @Field(()=>String)
  name: string;

  @ManyToOne(()=>User,(user)=>user.lists)
  @Index('user-list-index')
  user:User;

}
