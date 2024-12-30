export enum AppEnvironment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum EmployeeStatus {
  ACTIVE = "active",
  EX_EMPLOYEE = "ex-employee",
  RESIGNED = "resigned",
  TERMINATED = "terminated",
  PENDING = "pending",
}

export enum EmployeeRole {
  ADMIN = "admin",
  SALES_MANAGER = "sales_manager",
  SALES_EXECUTIVE = "sales_executive",
  PROJECT_MANAGER = "project_manager",
  TEAM_LEADER = "team_leader",
  SENIOR_SOFTWARE_ENGINEER = "senior_software_engineer",
  SOFTWARE_ENGINEER = "software_engineer",
  TRAINEE = "trainee",
}

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  HOLD = "hold",
}

export enum ProjectStatus {
  NOT_STARTED = "not_started",
  STARTED = "started",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
}

export enum BillingType {
  FIXED = "fixed",
  HOURLY = "hourly",
  MONTHLY = "monthly",
}

export enum CurrencyType {
  USD = "USD",
  GBP = "GBP",
  INR = "INR",
  EUR = "EUR",
}

export enum InvoiceStatus {
  GENERATED = "generated",
  PARTIAL_COMPLETED = "partial_completed",
  COMPLETED = "completed",
}

export enum InvoicePaymentCycle {
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
}

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  PARTIAL_PAID = "partial_paid",
}

export enum CrStatus {
  NOT_STARTED = "not_started",
  STARTED = "started",
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  PAYONEER = "payoneer",
  WIRE_TRANSFER = "wire_transfer",
  BANK_TRANSFER = "bank_transfer",
  WISE = "wise",
  PAYPAL = "paypal",
}

export enum COMPANY {
  NAME = "Infiazure Technology",
  EMAIL = "infiazure@gamil.com",
  ADDRESS = "A 502 Styamev Elite",
  COUNTRY_CODE = "IN",
  STATE_CODE = "GJ",
  CITY_NAME = "Ahmedabad",
}
