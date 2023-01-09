import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Resume } from './resume.enity';

@Table({
  modelName: 'skills',
})
export class ResumeSkills extends Model<ResumeSkills> {
  @Column
  title: string;

  @Column
  @ForeignKey(() => Resume)
  resumeId: number;
}
