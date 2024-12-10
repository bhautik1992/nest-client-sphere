import { CreateVendorDto } from "./create-vendor.dto";

export class UpdateVendorDto
  implements
    Pick<
      CreateVendorDto,
      | "firstName"
      | "lastName"
      | "phone"
      | "address"
      | "vendorCompanyName"
      | "accountManager"
      | "countryCode"
      | "stateCode"
      | "cityName"
      | "website"
      | "skypeId"
    >
{
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  website: string;
  vendorCompanyName: string;
  accountManager: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  skypeId: string;
}
