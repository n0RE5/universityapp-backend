import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import { Group } from "src/groups/groups.model"
import { User } from "src/users/users.model"
import { ApplicationStatus } from "./applications.enum"

interface ApplicationCreationAttrs {
    id: string
    groupId: string
    userId: string
    message?: string
}

@Table({tableName: 'applications'})
export class Application extends Model<Application, ApplicationCreationAttrs> {
    @Column({type: DataType.STRING, primaryKey: true, allowNull: false})
    id: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: ''
    })
    message: string

    @Column({
        type: DataType.ENUM(ApplicationStatus.pending, ApplicationStatus.approved, ApplicationStatus.rejected, ApplicationStatus.error), 
        allowNull: false,
        defaultValue: ApplicationStatus.pending
    })
    status: ApplicationStatus

    @Column({type: DataType.STRING, allowNull: true})
    reviewedAt: string | null

    @Column({type: DataType.STRING, allowNull: true})
    reviewedBy: string | null

    @ForeignKey(() => Group)
    groupId: string

    @ForeignKey(() => User)
    userId: string

    @BelongsTo(() => Group, {foreignKey: 'groupId', as: 'group'})
    group: Group

    @BelongsTo(() => User, {foreignKey: 'userId', as: 'user'})
    user: User
}