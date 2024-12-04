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
