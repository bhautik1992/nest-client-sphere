import { Employee } from "src/modules/employee/entity/employee.entity";
import { MockModel } from "./mock.model";

export class EmployeeModel extends MockModel<Employee> {
  protected entityStub = new Employee();
}
