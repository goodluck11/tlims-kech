import {Ad} from 'feature/items/ad';

export class Job extends Ad {
  companyName: string;
  jobType: string;
  minimumExp: string;
  responsibilities: string;
  requirements: string;
  miniQualification: string;
  salaryFrom: string;
  salaryTo: string;
}
