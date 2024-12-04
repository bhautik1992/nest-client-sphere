export enum AppEnvironment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum ClientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum ProjectStatus {
  NOT_STARTED = "not_started",
  STARTED = "started",
  PENDING = "pending",
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
  PAID = "paid",
  PENDING = "pending",
}

export enum Designation {
  ADMIN = "admin",
  PROJECT_MANAGER = "project_manager",
  SALES_MANAGER = "sales_manager",
  DEVELOPER = "developer",
  TESTER = "tester",
  INTERN = "intern",
}
