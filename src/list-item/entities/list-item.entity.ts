import { ObjectType, Field } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/list/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('listItems')
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column({type:'numeric'})
  quantity:number;

  @Column({type:'boolean'})
  completed:boolean

  @ManyToOne(()=>List, (list)=>list.listItem,{lazy:true})  
  list: List;

  @ManyToOne(()=>Item, (item)=>item.listItem,{lazy:true})  
  @Field(()=>Item)
  item:Item;

}
