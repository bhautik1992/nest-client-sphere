import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VENDOR_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { Repository } from "typeorm";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { ListVendorDto } from "./dto/list-payment.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { Vendor } from "./entity/vendor.entity";

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    try {
      if (await this.getVendorByEmail(createVendorDto.email)) {
        throw CustomError(
          VENDOR_RESPONSE_MESSAGES.VENDOR_ALREADY_EXISTS,
          HttpStatus.NOT_FOUND,
        );
      }
      const vendor = this.vendorRepository.create(createVendorDto);
      return await this.vendorRepository.save(vendor);
    } catch (error) {
      throw CustomError(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: ListVendorDto) {
    try {
      const queryBuilder = this.vendorRepository.createQueryBuilder("vendor");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "(vendor.firstName ILIKE :search OR vendor.lastName ILIKE :search OR vendor.phone ILIKE :search OR vendor.email ILIKE :search OR vendor.vendorCompanyName ILIKE :search)",
          { search: `%${params.search}%` },
        );
      }

      const totalQuery = queryBuilder.clone();

      // Apply pagination
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset);
        queryBuilder.take(params.limit);
      }

      // Apply sorting
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `vendor.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("vendor.createdAt", "DESC");
      }

      queryBuilder.leftJoinAndSelect("vendor.company", "company");

      if (params.deletedVendor) {
        queryBuilder.withDeleted();
        queryBuilder.andWhere("vendor.deletedAt IS NOT NULL");
      }

      const vendors = await queryBuilder.getMany();
      const vendorList = await Promise.all(
        vendors.map(async (vendor) => {
          const countryName =
            await this.countryStateCityService.getCountryByCode(
              vendor.countryCode,
            );
          let stateName = null;
          if (vendor.stateCode) {
            stateName = await this.countryStateCityService.getStateByCode(
              vendor.stateCode,
              vendor.countryCode,
            );
          }
          return {
            ...vendor,
            countryName,
            stateName,
          };
        }),
      );

      // Fetch the total count
      const recordsTotal = await totalQuery.getCount();

      return { result: vendorList, recordsTotal };
    } catch (error) {
      CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const isVendorExists = await this.vendorRepository.findOneBy({ id });
      if (!isVendorExists) {
        throw CustomError(
          VENDOR_RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const queryBuilder = this.vendorRepository
        .createQueryBuilder("vendor")
        .leftJoinAndSelect("vendor.company", "company")
        .where({ id })
        .where("vendor.deletedAt IS NULL");
      const vendor = await queryBuilder.getOne();
      const countryName = await this.countryStateCityService.getCountryByCode(
        vendor.countryCode,
      );
      let stateName = null;
      if (vendor.stateCode) {
        stateName = await this.countryStateCityService.getStateByCode(
          vendor.stateCode,
          vendor.countryCode,
        );
      }
      return { ...vendor, countryName, stateName };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    try {
      const isVendorExists = await this.vendorRepository.findOneBy({ id });
      if (!isVendorExists) {
        throw CustomError(
          VENDOR_RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const updatedEntity = { id, ...updateVendorDto };
      const updatedVendor = await this.vendorRepository.save(updatedEntity);
      return updatedVendor;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(id: number) {
    try {
      const isVendorExists = await this.vendorRepository.findOneBy({ id });
      if (!isVendorExists) {
        throw CustomError(
          VENDOR_RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.vendorRepository.softDelete({ id });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getVendorByEmail(email: string) {
    return await this.vendorRepository.findOneBy({ email });
  }
}
