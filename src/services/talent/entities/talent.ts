import { ServiceBaseEntity } from "platform-api";
import { Entity, Column } from "typeorm";
import {
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsObject,
  IsArray,
  ArrayUnique,
} from "class-validator";

@Entity()
export class Talent extends ServiceBaseEntity {
  @Column({ default: true })
  @IsBoolean()
  public enabled: boolean;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Column({ type: "json" })
  @ArrayUnique()
  public agents: [];

  @Column({ nullable: true })
  @IsString()
  public headline: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  public bio_highlights: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  public bio_details: string;

  @Column({ type: "json" })
  @IsObject()
  public social_accounts: {};

  @Column({ type: "json" })
  @IsObject()
  public metadata: {};

  @Column({ type: "json" })
  @IsArray()
  public reviews: [];

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public notes: string;

  @Column({ type: "json" })
  @ArrayUnique()
  public categories: [];

  @Column({ type: "json" })
  @ArrayUnique()
  public topics: [];
}
