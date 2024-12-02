import { ProjectStatus } from "src/common/constants/enum.constant";
import { CreateProjectDto } from "./create-project.dto";

export class UpdateProjectDto
  implements
    Pick<
      CreateProjectDto,
      | "name"
      | "description"
      | "status"
      | "amount"
      | "startDate"
      | "endDate"
      | "companyId"
    >
{
  name: string;
  description: string;
  status: ProjectStatus;
  amount: number;
  startDate: string;
  endDate: string;
  companyId: number;
}
