import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:"User"})
export class UserEntity{
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column({unique:true})
    username:string;

    @Column()
    password:string;

    @Column()
    role:'Employee' | 'Manager' | 'Admin'



}