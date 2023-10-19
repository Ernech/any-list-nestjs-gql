import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/list/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listItems')
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field(()=>ID)
  id:string;

  @Column({type:'numeric'})
  @Field(()=>Number)
  quantity:number;

  @Column({type:'boolean'})
  @Field(()=>Boolean)
  completed:boolean

  @ManyToOne(()=>List, (list)=>list.listItem,{lazy:true})  
  list: List;

  @ManyToOne(()=>Item, (item)=>item.listItem,{lazy:true})  
  @Field(()=>Item)
  item:Item;

}

//@Unique('listItem-item', ['list','item'])
