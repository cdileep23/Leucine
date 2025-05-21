import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { softwareEntity } from "./software.entity";

@Entity({name:"Request"})
    export class RequestEntity{
    @PrimaryGeneratedColumn()
    id:string;

    @ManyToOne(()=>UserEntity)
    user:UserEntity

    @ManyToOne(()=>softwareEntity)
    software:softwareEntity

    @Column()
    accessType:'Read'| 'Write' | 'Admin'

    @Column()
    reason:string

    @Column()
    status:'Pending'|'Approved'|'Rejected'

}