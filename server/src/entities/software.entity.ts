import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'Software'})
export class softwareEntity{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    name:string;

    @Column('text')
    description:string;

    @Column('simple-array')
    accessLevels:string[];


}