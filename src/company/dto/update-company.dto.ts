import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto
  implements Pick<CreateCompanyDto, "name" | "address" | "countryId">
{
  name: string;
  address: string;
  countryId: number;
}
