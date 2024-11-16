export interface IGetScheduleResponse {
    groupName: string
    schedule: {
        [key: string]: ILesson[]
    }
}

export interface IUniversityGroup {
    groupName: string
    id: number
    currentWeekScheduleLink: string
}

export default interface ILesson {
    groupName: string
    subgroup: string
    dayOfWeek: number
    lessonDate: string // ISO string
    lessonOrderNumber: number
    lessonStartTime: string
    lessonEndTime: string
    lessonType: LessonType
    classroomName: string
    classroomFloor: number
    classroomBuilding: string
    disciplineName: string
    teachers: ILessonTeacher[]
}

export interface ILessonTeacher {
    firstName: string
    lastName: string
    patronymic: string
}

export const ScheduleDays = {
    1: 'понедельник',
    2: 'вторник',
    3: 'среда',
    4: 'четверг',
    5: 'пятница',
    6: 'суббота'
} as const

export const LessonTypes = {
    practice: 'Практические занятия',
    lection: 'Лекционные занятия'
} as const

export type LessonType = typeof LessonTypes[keyof typeof LessonTypes]