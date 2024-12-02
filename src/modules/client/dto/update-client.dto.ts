import { ClientStatus } from "src/common/constants/enum.constant";
import { CreateClientDto } from "./create-client.dto";

export class UpdateClientDto
  implements
    Pick<
      CreateClientDto,
      | "firstName"
      | "lastName"
      | "phone"
      | "companyName"
      | "address"
      | "gender"
      | "countryCode"
      | "stateCode"
      | "cityName"
      | "status"
    >
{
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  address: string;
  gender: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  status: ClientStatus;
}
