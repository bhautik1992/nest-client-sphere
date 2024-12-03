import { ClientStatus } from "src/common/constants/enum.constant";
import { CreateClientDto } from "./create-client.dto";

export class UpdateClientDto
  implements
    Pick<
      CreateClientDto,
      | "firstName"
      | "lastName"
      | "phone"
      | "address"
      | "gender"
      | "designation"
      | "accountManager"
      | "countryCode"
      | "stateCode"
      | "cityName"
      | "status"
      | "zipCode"
    >
{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  gender: string;
  designation: string;
  accountManager: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  status: ClientStatus;
  zipCode: string;
}
