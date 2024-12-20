import { Clients } from "src/modules/client/entity/client.entity";
import { Companies } from "src/modules/company/entity/company.entity";

export interface JwtPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ExtendedCompany extends Companies {
  countryName?: string;
  stateName?: string;
}

export interface ExtendedClient extends Clients {
  countryName?: string;
  stateName?: string;
}
