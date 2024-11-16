import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { Application } from "src/applications/applications.model"
import { Group } from "src/groups/groups.model"
import { Role } from "src/roles/roles.model"
import { UserRole } from "src/roles/user-roles.model"

interface UserCreationAttrs {
    id: string
    firstName: string
    lastName: string
    telegramId: number
    patronymic?: string
    photoUrl?: string
    name?: string | null
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {
    @Column({type: DataType.STRING, primaryKey: true, allowNull: false})
    id: string
    
    @Column({type: DataType.STRING, allowNull: true})
    name: string | null

    @Column({type: DataType.BIGINT, allowNull: false, unique: true})
    telegramId: number

    @Column({type: DataType.STRING, allowNull: false, defaultValue: ''})
    firstName: string

    @Column({type: DataType.STRING, allowNull: false, defaultValue: ''})
    lastName: string

    @Column({type: DataType.STRING, allowNull: false, defaultValue: ''})
    patronymic: string

    @Column({type: DataType.STRING, allowNull: false, defaultValue: ''})
    photoUrl: string

    @ForeignKey(() => Group)
    groupId: string | null

    @BelongsTo(() => Group, {foreignKey: 'groupId', as: 'group'})
    group: Group

    @HasMany(() => Application)
    applications: Application[]

    @BelongsToMany(() => Role, () => UserRole)
    roles: Role[]
}