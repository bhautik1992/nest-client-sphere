import { Designation } from "src/common/constants/enum.constant";
import { CreateVendorDto } from "./create-vendor.dto";

export class UpdateVendorDto
  implements
    Pick<
      CreateVendorDto,
      | "firstName"
      | "lastName"
      | "phone"
      | "address"
      | "designation"
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
  designation: Designation;
  vendorCompanyName: string;
  accountManager: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  skypeId: string;
}
