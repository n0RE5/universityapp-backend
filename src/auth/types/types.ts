export interface UserJWTPayload {
    id: string
    groupId: string | null
    roles: { id: number, name: string }[]
}