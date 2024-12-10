import { CreateEmployeeDto } from "./create-employee.dto";

export class UpdateEmployeeDto
  implements
    Pick<
      CreateEmployeeDto,
      "firstName" | "lastName" | "phone" | "personalEmail" | "reportingPersonId"
    >
{
  firstName: string;
  lastName: string;
  phone: string;
  personalEmail: string;
  reportingPersonId: number;
}
