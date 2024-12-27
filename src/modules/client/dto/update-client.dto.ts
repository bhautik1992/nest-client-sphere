import { ClientStatus } from "src/common/constants/enum.constant";
import { CreateClientDto } from "./create-client.dto";

export class UpdateClientDto
  implements
    Pick<
      CreateClientDto,
      | "firstName"
      | "lastName"
      | "nickName"
      | "phone"
      | "address"
      | "gender"
      | "clientCompanyName"
      | "accountManagerId"
      | "countryCode"
      | "stateCode"
      | "cityName"
      | "status"
      | "zipCode"
      | "comment"
      | "website"
    >
{
  firstName: string;
  lastName: string;
  nickName: string;
  phone: string;
  address: string;
  gender: string;
  clientCompanyName: string;
  accountManagerId: number;
  countryCode: string;
  stateCode: string;
  cityName: string;
  status: ClientStatus;
  zipCode: string;
  comment: string;
  website: string;
}
