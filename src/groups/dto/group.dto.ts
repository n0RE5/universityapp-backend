import { Group } from "../groups.model"

export class GroupDto {
    readonly id: string
    readonly name: string
    readonly externalId: number
    constructor(group: Group) {
        this.id = group.id
        this.name = group.name
        this.externalId = group.externalId
    }
}