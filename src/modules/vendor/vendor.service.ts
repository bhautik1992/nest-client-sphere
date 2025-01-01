import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { COMPANY } from "src/common/constants/enum.constant";
import { VENDOR_RESPONSE_MESSAGES } from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import { JwtPayload } from "src/common/interfaces/jwt.interface";
import { Repository } from "typeorm";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { ListVendorDto } from "./dto/list-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { Vendors } from "./entity/vendor.entity";

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendors)
    private readonly vendorRepository: Repository<Vendors>,
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  async createInitialCompany() {
    try {
      const isVendorExists = await this.vendorRepository.findOneBy({
        email: COMPANY.EMAIL,
      });
      if (isVendorExists) {
        return;
      }
      const vendor = this.vendorRepository.create({
        name: COMPANY.NAME,
        email: COMPANY.EMAIL,
        address: COMPANY.ADDRESS,
        countryCode: COMPANY.COUNTRY_CODE,
        stateCode: COMPANY.STATE_CODE,
        cityName: COMPANY.CITY_NAME,
        createdBy: 0,
      });
      await this.vendorRepository.save(vendor);
    } catch (error) {
      throw CustomError;
    }
  }

  async create(createVendorDto: CreateVendorDto, currentUser: JwtPayload) {
    try {
      if (await this.getVendorByEmail(createVendorDto.email)) {
        throw CustomError(
          VENDOR_RESPONSE_MESSAGES.VENDOR_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }
      createVendorDto.createdBy = currentUser.id;
      const vendor = this.vendorRepository.create(createVendorDto);
      const createdVendor = await this.vendorRepository.save(vendor);
      return createdVendor;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findAll(params: ListVendorDto) {
    try {
      const queryBuilder = this.vendorRepository.createQueryBuilder("vendor");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "vendor.name ILIKE :search OR vendor.email ILIKE :search",
          {
            search: `%${params.search}%`,
          },
        );
      }

      if (params.name)
        queryBuilder.andWhere("vendor.name ILIKE :name", {
          name: params.name,
        });
      if (params.email)
        queryBuilder.andWhere("vendor.email ILIKE :email", {
          email: params.email,
        });

      const totalQuery = queryBuilder.clone();

      // Apply pagination if page and limit are provided
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset).take(params.limit);
      }

      // Apply sorting if sort and sortBy are provided
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `vendor.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("vendor.createdAt", "DESC");
      }

      queryBuilder
        .leftJoinAndSelect("vendor.assignedToProjects", "assignedToProjects")
        .andWhere("vendor.email != :email", { email: COMPANY.EMAIL });

      if (params.deletedVendor) {
        queryBuilder.withDeleted();
        queryBuilder.andWhere("vendor.deletedAt IS NOT NULL");
      }

      const companies = await queryBuilder.getMany();

      const vendorList = await Promise.all(
        companies.map(async (vendor) => {
          const countryName =
            await this.countryStateCityService.getCountryByCode(
              vendor.countryCode,
            );
          const stateName = await this.countryStateCityService.getStateByCode(
            vendor.stateCode,
            vendor.countryCode,
          );
          return {
            ...vendor,
            countryName,
            stateName,
          };
        }),
      );

      // Get the total count based on the original query
      const recordsTotal = await totalQuery.getCount();
      return {
        result: vendorList,
        recordsTotal,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const vendor = await this.vendorRepository.findOneBy({ id });
      if (!vendor) {
        throw CustomError(
          VENDOR_RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const queryBuilder = this.vendorRepository.createQueryBuilder("vendor");
      queryBuilder
        .leftJoinAndSelect("vendor.assignedToProjects", "assignedToProjects")
        .where("vendor.deletedAt IS NULL");
      const vendorData = await queryBuilder.where({ id }).getOne();
      const countryName = await this.countryStateCityService.getCountryByCode(
        vendor.countryCode,
      );
      const stateName = await this.countryStateCityService.getStateByCode(
        vendor.stateCode,
        vendor.countryCode,
      );
      return { ...vendorData, countryName, stateName };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    try {
      const vendor = await this.vendorRepository.findOneBy({ id });
      if (!vendor) {
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
      const vendor = await this.vendorRepository.findOneBy({ id });
      if (!vendor) {
        throw CustomError(
          VENDOR_RESPONSE_MESSAGES.VENDOR_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.vendorRepository.softDelete(id);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async getVendorByEmail(email: string) {
    return await this.vendorRepository.findOneBy({ email });
  }
}
