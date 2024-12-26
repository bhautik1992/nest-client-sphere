import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthModule } from "./security/auth/auth.module";
import { JwtAuthGuard } from "./security/auth/guards/jwt-auth.guard";
import { DatabaseModule } from "./providers/database/postgres/database.module";
import { ThrottleModule } from "./security/throttle/throttle.module";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import AppConfiguration from "./config/app.config";
import DatabaseConfiguration from "./config/database.config";
import AuthConfiguration from "./config/auth.config";
import { EmployeeModule } from "./modules/employee/employee.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { ClientModule } from "./modules/client/client.module";
import { ProjectModule } from "./modules/project/project.module";
import { VendorModule } from "./modules/vendor/vendor.module";
import { CountryStateCityModule } from "./modules/country-state-city/country-state-city.module";
import { CrModule } from "./modules/cr/cr.module";
import { InvoiceModule } from "./modules/invoice/invoice.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { MileStoneModule } from "./modules/mile-stone/mile-stone.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration, DatabaseConfiguration, AuthConfiguration],
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    EmployeeModule,
    DashboardModule,
    ThrottleModule,
    ClientModule,
    ProjectModule,
    VendorModule,
    CountryStateCityModule,
    CrModule,
    InvoiceModule,
    PaymentModule,
    MileStoneModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
