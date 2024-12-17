import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoices } from "./entity/invoice.entity";
import { In, Repository } from "typeorm";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { CustomError } from "src/common/helpers/exceptions";
import { ListDto } from "src/common/dto/common.dto";
import {
  CR_RESPONSE_MESSAGES,
  INVOICE_RESPONSE_MESSAGES,
} from "src/common/constants/response.constant";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { Companies } from "../company/entity/company.entity";
import { Clients } from "../client/entity/client.entity";
import { Crs } from "../cr/entity/cr.entity";
import { CrService } from "../cr/cr.service";

interface ExtendedCompany extends Companies {
  countryName?: string;
  stateName?: string;
}

interface ExtendedClient extends Clients {
  countryName?: string;
  stateName?: string;
}

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoices)
    private readonly invoiceRepository: Repository<Invoices>,
    @InjectRepository(Crs)
    private readonly crRepository: Repository<Crs>,
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      let crs: Crs[] = [];
      if (createInvoiceDto.crIds && createInvoiceDto.crIds.length > 0) {
        crs = await this.crRepository.find({
          where: { id: In(createInvoiceDto.crIds) },
        });
        if (crs.length !== createInvoiceDto.crIds.length) {
          throw CustomError(
            CR_RESPONSE_MESSAGES.CR_NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // update Cr Cost
      if (
        createInvoiceDto.isUpdateCrAmount &&
        createInvoiceDto.crInvoiceAmount?.length > 0
      ) {
        const crIds = createInvoiceDto.crInvoiceAmount.map((cr) => cr.id);
        const crRecords = await this.crRepository.find({
          where: {
            id: In(crIds),
          },
        });
        const crMap = new Map(crRecords.map((cr) => [cr.id, cr]));
        const updatePromises = createInvoiceDto.crInvoiceAmount.map(
          async (crInvoice) => {
            const cr = crMap.get(crInvoice.id);
            if (!cr) {
              throw CustomError(
                CR_RESPONSE_MESSAGES.CR_NOT_FOUND,
                HttpStatus.NOT_FOUND,
              );
            }
            cr.crCost = crInvoice.crCost;
            cr.isInvoiced = true;
            return this.crRepository.save(cr);
          },
        );
        await Promise.all(updatePromises);
      }

      const invoice = this.invoiceRepository.create({
        ...createInvoiceDto,
        crs,
      });
      return await this.invoiceRepository.save(invoice);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findAll(params: ListDto) {
    try {
      const queryBuilder = this.invoiceRepository.createQueryBuilder("invoice");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "invoice.invoiceNumber ILIKE :search OR invoice.invoiceDate ILIKE :search",
          { search: `%${params.search}%` },
        );
      }

      const totalQuery = queryBuilder.clone();

      // Apply pagination if page and limit are provided
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset).take(params.limit);
      }

      // Apply sorting if sort and sortBy are provided
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `invoice.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("invoice.createdAt", "DESC");
      }

      queryBuilder
        .leftJoinAndSelect("invoice.project", "project")
        .leftJoinAndSelect("project.projectManager", "projectManager")
        .leftJoinAndSelect("project.teamLeader", "teamLeader")
        .leftJoinAndSelect("invoice.client", "client")
        .leftJoinAndSelect("invoice.company", "company")
        .leftJoinAndSelect("invoice.crs", "crs");

      const invoices = await queryBuilder.getMany();

      const invoiceList = await Promise.all(
        invoices.map(async (invoice) => {
          const clientCountryName =
            await this.countryStateCityService.getCountryByCode(
              invoice.client.countryCode,
            );
          const companyCountryName =
            await this.countryStateCityService.getCountryByCode(
              invoice.company.countryCode,
            );
          let clientStateName = null;
          let companyStateName = null;
          if (invoice.client.stateCode) {
            clientStateName = await this.countryStateCityService.getStateByCode(
              invoice.client.stateCode,
              invoice.client.countryCode,
            );
          }
          if (invoice.company.stateCode) {
            companyStateName =
              await this.countryStateCityService.getStateByCode(
                invoice.company.stateCode,
                invoice.company.countryCode,
              );
          }
          const extendedCompany: ExtendedCompany = {
            ...invoice.company,
            countryName: companyCountryName,
            stateName: companyStateName,
          };
          const extendedClient: ExtendedClient = {
            ...invoice.client,
            countryName: clientCountryName,
            stateName: clientStateName,
          };
          return {
            ...invoice,
            company: extendedCompany,
            client: extendedClient,
          };
        }),
      );

      const recordsTotal = await totalQuery.getCount();

      return {
        result: invoiceList,
        recordsTotal,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const isInvoiceExist = await this.invoiceRepository.findOneBy({ id });
      if (!isInvoiceExist) {
        throw CustomError(
          INVOICE_RESPONSE_MESSAGES.INVOICE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const queryBuilder = this.invoiceRepository.createQueryBuilder("invoice");
      const invoice = await queryBuilder
        .leftJoinAndSelect("invoice.project", "project")
        .leftJoinAndSelect("project.projectManager", "projectManager")
        .leftJoinAndSelect("project.teamLeader", "teamLeader")
        .leftJoinAndSelect("invoice.client", "client")
        .leftJoinAndSelect("invoice.company", "company")
        .leftJoinAndSelect("invoice.crs", "crs")
        .where("invoice.id = :id", { id })
        .getOne();

      const clientCountryName =
        await this.countryStateCityService.getCountryByCode(
          invoice.client.countryCode,
        );
      const companyCountryName =
        await this.countryStateCityService.getCountryByCode(
          invoice.company.countryCode,
        );
      let clientStateName = null;
      let companyStateName = null;
      if (invoice.client.stateCode) {
        clientStateName = await this.countryStateCityService.getStateByCode(
          invoice.client.stateCode,
          invoice.client.countryCode,
        );
      }
      if (invoice.company.stateCode) {
        companyStateName = await this.countryStateCityService.getStateByCode(
          invoice.company.stateCode,
          invoice.company.countryCode,
        );
      }
      const extendedCompany: ExtendedCompany = {
        ...invoice.company,
        countryName: companyCountryName,
        stateName: companyStateName,
      };
      const extendedClient: ExtendedClient = {
        ...invoice.client,
        countryName: clientCountryName,
        stateName: clientStateName,
      };
      return {
        ...invoice,
        company: extendedCompany,
        client: extendedClient,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async delete(id: number) {
    try {
      const isInvoiceExist = await this.invoiceRepository.findOneBy({ id });
      if (!isInvoiceExist) {
        throw CustomError(
          INVOICE_RESPONSE_MESSAGES.INVOICE_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.invoiceRepository.delete({ id });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
