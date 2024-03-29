import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { IProduct } from "../../domain/models/product";
import { ProductImage } from "./product-image";
import { Store } from "./store";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: "product",
  modelName: "Product",
}) 
export class Product extends Model<IProduct> {
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    primaryKey: true,
  })
  declare id?: string;

  @ForeignKey(() => Store) // foreign key
  @Column
  storeId!: string;
  
  @Column({
    type: DataType.STRING(128),
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
    defaultValue: 0,
  })
  amount!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  description!: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  longDescription!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  durationOfRentage!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  condition!: string;

  @Column({
    type: DataType.DATE,
  })
  availabilityStartDate!: Date;

  @Column({
    type: DataType.DATE,
  })
  availabilityEndDate!: Date;

  @Column({
    type: DataType.DATE,
  })
  availabilityStartTime!: Date;

  @Column({
    type: DataType.DATE,
  })
  availabilityEndTime!: Date;

  // relationships
  @HasMany(() => ProductImage)
  productImages!: ProductImage[];

  @BelongsTo(() => Store, "storeId")
  store!: Store;
}
