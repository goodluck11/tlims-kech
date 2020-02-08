import {Ad} from 'feature/items/ad';
import {CodeValue} from 'core/model/base-model';

export class Job extends Ad {
  companyName: string;
  jobType: CodeValue = new CodeValue();
  minimumExp: CodeValue = new CodeValue();
  responsibilities: string;
  requirements: string;
  miniQualification: string;
  salaryFrom: string;
  salaryTo: string;
}
