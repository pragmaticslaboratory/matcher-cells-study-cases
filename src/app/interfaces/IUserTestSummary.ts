import { IUserTest } from './IUserTest';
import { EStatusUserTestSummary } from '../enums/EStatusUserTestSummary';
export interface IUserTestSumary extends IUserTest {
    totalTime?: number;
    status?: EStatusUserTestSummary;
}