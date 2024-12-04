import { ClientStatus, Designation } from "src/common/constants/enum.constant";
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
      | "clientCompanyName"
      | "accountManager"
      | "countryCode"
      | "stateCode"
      | "cityName"
      | "status"
      | "zipCode"
      | "skypeId"
    >
{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  gender: string;
  designation: Designation;
  clientCompanyName: string;
  accountManager: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  status: ClientStatus;
  zipCode: string;
  skypeId: string;
}
