export default class CreateUserDto {
    readonly firstName: string
    readonly lastName: string
    readonly telegramId: number
    readonly photoUrl?: string
    readonly username?: string
}