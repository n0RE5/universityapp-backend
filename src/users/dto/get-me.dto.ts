import { User } from "../users.model"

export default class GetMeDto {
    readonly id: string
    readonly groupId: string | null
    readonly firstName: string
    readonly lastName: string
    readonly patronymic: string
    readonly photoUrl: string

    constructor(user: User) {
        this.id = user.id
        this.groupId = user.groupId
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.patronymic = user.patronymic
        this.photoUrl = user.photoUrl
    }
}