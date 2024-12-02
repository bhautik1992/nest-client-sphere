import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto
  implements Pick<CreateUserDto, "first_name" | "last_name" | "phone">
{
  first_name: string;
  last_name: string;
  phone: string;
}
