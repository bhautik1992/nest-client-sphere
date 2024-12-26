import { CreateVendorDto } from "./create-vendor.dto";

export class UpdateVendorDto
  implements
    Pick<
      CreateVendorDto,
      "name" | "address" | "countryCode" | "stateCode" | "cityName" | "comment"
    >
{
  name: string;
  address: string;
  countryCode: string;
  stateCode: string;
  cityName: string;
  comment: string;
}
