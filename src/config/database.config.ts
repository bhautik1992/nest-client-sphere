import { registerAs } from "@nestjs/config";
import { EmployeeRole } from "src/common/constants/enum.constant";

export default registerAs("database", () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 27017,
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  initialEmployee: {
    firstName: "Infiazure",
    lastName: "Technology",
    role: EmployeeRole.ADMIN,
    personalEmail: "admin@gmail.com",
    companyEmail: "admin@infiazure.com",
    phone: "1234567890",
    department: "Admin",
    dateOfBirth: new Date(),
    joiningDate: new Date(),
    reportingPerson: "Infiazure",
    password: "Infiazure@123",
  },
  postgres: {
    enableSSL: process.env.ENABLE_SQL_SSL ? process.env.ENABLE_SQL_SSL : false,
  },
}));
