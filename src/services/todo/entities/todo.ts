import { ServiceBaseEntity } from "platform-api";
import { Entity, Column } from "typeorm";
import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

@Entity()
export class Todo extends ServiceBaseEntity {
  @Column({ nullable: false, type: "text" })
  @IsString()
  @IsNotEmpty()
  public title: string;

  @Column({ nullable: false, default: false })
  @IsBoolean()
  @IsOptional()
  public done: boolean;
}
