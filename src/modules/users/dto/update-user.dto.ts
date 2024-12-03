import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
  implements
    Pick<
      CreateUserDto,
      | "firstName"
      | "lastName"
      | "phone"
      | "personalEmail"
      | "reportingPerson"
      | "designation"
    >
{
  firstName: string;
  lastName: string;
  phone: string;
  personalEmail: string;
  reportingPerson: string;
  designation: string;
}
