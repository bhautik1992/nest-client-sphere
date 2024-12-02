import { ClientStatus } from "src/common/constants/enum.constant";
import { CreateClientDto } from "./create-client.dto";

export class UpdateClientDto
  implements
    Pick<
      CreateClientDto,
      "name" | "phone" | "address" | "gender" | "countryId" | "status"
    >
{
  name: string;
  phone: string;
  address: string;
  gender: string;
  countryId: number;
  status: ClientStatus;
}
