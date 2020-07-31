import { ServiceBaseEntity } from "platform-api";
import { Entity, Column } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";

@Entity()
export class Quote extends ServiceBaseEntity {
  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  public value: string;
}
