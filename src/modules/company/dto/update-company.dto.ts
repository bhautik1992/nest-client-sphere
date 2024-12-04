import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto
  implements
    Pick<
      CreateCompanyDto,
      "name" | "address" | "countryCode" | "stateCode" | "cityName"
    >
{
  name: string;
  address: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
}
