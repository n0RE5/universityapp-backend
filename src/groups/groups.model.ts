import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript"
import { Application } from "src/applications/applications.model"
import { User } from "src/users/users.model"

interface GroupCreationAttrs {
    id: string
    name: string
    externalId: number
}

@Table({tableName: 'groups'})
export class Group extends Model<Group, GroupCreationAttrs> {
    @Column({type: DataType.STRING, primaryKey: true, allowNull: false})
    id: string

    @Column({type: DataType.STRING})
    name: string

    @Column({type: DataType.INTEGER})
    externalId: number

    @Column({type: DataType.STRING, allowNull: true})
    headmanId: string

    @HasMany(() => User)
    users: User[]

    @HasMany(() => Application)
    applications: Application[]
}