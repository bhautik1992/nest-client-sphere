import { Designation } from "src/common/constants/enum.constant";
import { CreateEmployeeDto } from "./create-employee.dto";

export class UpdateEmployeeDto
  implements
    Pick<
      CreateEmployeeDto,
      | "firstName"
      | "lastName"
      | "phone"
      | "personalEmail"
      | "reportingPersonId"
      | "designation"
    >
{
  firstName: string;
  lastName: string;
  phone: string;
  personalEmail: string;
  reportingPersonId: number;
  designation: Designation;
}
