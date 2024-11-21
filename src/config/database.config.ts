import { registerAs } from "@nestjs/config";
import { UserRole } from "src/common/constants/enum.constant";

export default registerAs("database", () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 27017,
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  initialUser: {
    first_name: "Infiazure",
    last_name: "Technology",
    role: UserRole.ADMIN,
    email: "admin@infiazure.com",
    password: "Infiazure@123",
  },
  postgres: {
    enableSSL: process.env.ENABLE_SQL_SSL ? process.env.ENABLE_SQL_SSL : false,
  },
}));
