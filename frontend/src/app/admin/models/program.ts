import { UserFacingProgram } from '../../shared/models';
import { QuestionKey } from './question-key';

export interface ProgramCondition {
  questionKey: QuestionKey;
  value: boolean | string | number;
  type: 'boolean' | 'text' | 'number';
  qualifier?: string | 'lessThan' | 'lessThanOrEqual' | 'equal' | 'greaterThanOrEqual' | 'greaterThan';
}

export interface ProgramQuery {
  guid: string;
  id: string;
  conditions: ProgramCondition[];
}

export interface ApplicationFacingProgram {
  guid: string;
  application: ProgramQuery[];
  user: UserFacingProgram;
}
