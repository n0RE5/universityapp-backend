import { Application } from "../applications.model"

export class ApplicationDto {
    readonly id: string
    readonly createdAt: string
    readonly userId: string
    readonly firstName: string
    readonly lastName: string
    readonly patronymic: string
    readonly photoUrl: string
    readonly name: string | null

    constructor(application: Application) {
        this.id = application.id
        this.createdAt = application.createdAt
        this.userId = application.userId
        this.firstName = application.user.firstName
        this.lastName = application.user.lastName
        this.patronymic = application.user.patronymic
        this.photoUrl = application.user.photoUrl
        this.name = application.user.username
    }
}