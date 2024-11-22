import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto
  implements Pick<CreateCompanyDto, "name" | "address" | "country">
{
  name: string;
  address: string;
  country: string;
}
