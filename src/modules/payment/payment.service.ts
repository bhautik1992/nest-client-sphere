import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  INVOICE_RESPONSE_MESSAGES,
  PAYMENT_RESPONSE_MESSAGES,
} from "src/common/constants/response.constant";
import { CustomError } from "src/common/helpers/exceptions";
import {
  ExtendedClient,
  ExtendedCompany,
} from "src/common/interfaces/jwt.interface";
import { In, Repository } from "typeorm";
import { CountryStateCityService } from "../country-state-city/country-state-city.service";
import { Invoices } from "../invoice/entity/invoice.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ListPaymentDto } from "./dto/list-payment.dto";
import { Payments } from "./entity/payment.entity";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepository: Repository<Payments>,
    @InjectRepository(Invoices)
    private readonly invoiceRepository: Repository<Invoices>,
    private readonly countryStateCityService: CountryStateCityService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      let invoices: Invoices[] = [];
      if (
        createPaymentDto.invoiceIds &&
        createPaymentDto.invoiceIds.length > 0
      ) {
        invoices = await this.invoiceRepository.find({
          where: {
            id: In(createPaymentDto.invoiceIds),
          },
        });
        if (invoices.length !== createPaymentDto.invoiceIds.length) {
          throw CustomError(
            INVOICE_RESPONSE_MESSAGES.INVOICE_NOT_FOUND,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (
        createPaymentDto.invoiceAmount &&
        createPaymentDto.invoiceAmount?.length > 0
      ) {
        for (let invoice of createPaymentDto.invoiceAmount) {
          const invoiceData = await this.invoiceRepository.findOneBy({
            id: invoice.id,
          });
          if (invoiceData) {
            invoiceData.isPaymentReceived = true;
            await this.invoiceRepository.save(invoiceData);
          }
        }

        // Calculate the total amount
        const totalAmount = createPaymentDto.invoiceAmount.reduce(
          (total, invoice) => total + Number(invoice.invoicedCost),
          0,
        );
        createPaymentDto.paymentAmount = totalAmount;
      }

      const payment = this.paymentRepository.create({
        ...createPaymentDto,
        invoices,
      });
      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findAll(params: ListPaymentDto) {
    try {
      const queryBuilder = this.paymentRepository.createQueryBuilder("payment");

      // Apply search filter if the search term is provided
      if (params.search) {
        queryBuilder.where(
          "payment.paymentDate ILIKE :search OR payment.paymentNumber ILIKE :search OR payment.uniquePaymentId ILIKE :search",
          {
            search: `%${params.search}%`,
          },
        );
      }

      const totalQuery = queryBuilder.clone();

      // Apply pagination
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset);
        queryBuilder.take(params.limit);
      }

      // Apply sorting
      if (params.sortBy) {
        queryBuilder.orderBy(
          `payment.${params.sortBy}`,
          params.sortOrder === "asc" ? "ASC" : "DESC",
        );
      } else {
        queryBuilder.orderBy("payment.createdAt", "DESC");
      }

      queryBuilder
        .leftJoinAndSelect("payment.client", "client")
        .leftJoinAndSelect("payment.project", "project")
        .leftJoinAndSelect("payment.company", "company")
        .leftJoinAndSelect("payment.invoices", "invoices");

      if (params.deletedPayment) {
        queryBuilder.withDeleted();
        queryBuilder.andWhere("payment.deletedAt IS NOT NULL");
      }

      const payments = await queryBuilder.getMany();

      const paymentList = await Promise.all(
        payments.map(async (invoice) => {
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
        result: paymentList,
        recordsTotal,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.paymentRepository.findOneBy({ id });
      if (!payment) {
        throw CustomError(
          PAYMENT_RESPONSE_MESSAGES.PAYMENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const queryBuilder = this.paymentRepository.createQueryBuilder("payment");
      const paymentData = await queryBuilder
        .leftJoinAndSelect("payment.client", "client")
        .leftJoinAndSelect("payment.project", "project")
        .leftJoinAndSelect("payment.company", "company")
        .leftJoinAndSelect("payment.invoices", "invoices")
        .where("payment.id = :id", { id })
        .andWhere("payment.deletedAt IS NULL")
        .getOne();

      const clientCountryName =
        await this.countryStateCityService.getCountryByCode(
          paymentData.client.countryCode,
        );
      const companyCountryName =
        await this.countryStateCityService.getCountryByCode(
          paymentData.company.countryCode,
        );
      let clientStateName = null;
      let companyStateName = null;
      if (paymentData.client.stateCode) {
        clientStateName = await this.countryStateCityService.getStateByCode(
          paymentData.client.stateCode,
          paymentData.client.countryCode,
        );
      }
      if (paymentData.company.stateCode) {
        companyStateName = await this.countryStateCityService.getStateByCode(
          paymentData.company.stateCode,
          paymentData.company.countryCode,
        );
      }
      const extendedCompany: ExtendedCompany = {
        ...paymentData.company,
        countryName: companyCountryName,
        stateName: companyStateName,
      };
      const extendedClient: ExtendedClient = {
        ...paymentData.client,
        countryName: clientCountryName,
        stateName: clientStateName,
      };
      return {
        ...paymentData,
        company: extendedCompany,
        client: extendedClient,
      };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async delete(id: number) {
    try {
      const payment = await this.paymentRepository.findOneBy({ id });
      if (!payment) {
        throw CustomError(
          PAYMENT_RESPONSE_MESSAGES.PAYMENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.paymentRepository.softDelete({ id });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}
