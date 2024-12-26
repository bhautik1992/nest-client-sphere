import { Clients } from "src/modules/client/entity/client.entity";
import { Vendors } from "src/modules/vendor/entity/vendor.entity";

export interface JwtPayload {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ExtendedCompany extends Vendors {
  countryName?: string;
  stateName?: string;
}

export interface ExtendedClient extends Clients {
  countryName?: string;
  stateName?: string;
}
