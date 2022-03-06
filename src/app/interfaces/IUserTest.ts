export interface IUserTest {
    id: number,
    name: string,
    icon: string,
    content: string,
    input: string,
    started: boolean,
    completed: boolean,
    failed: boolean,
    initTime?: Date,
    finalTime?: Date
};
