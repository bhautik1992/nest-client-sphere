import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
  implements Pick<CreateUserDto, "firstName" | "lastName" | "phone">
{
  firstName: string;
  lastName: string;
  phone: string;
}
