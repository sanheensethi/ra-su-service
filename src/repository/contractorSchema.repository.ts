import { pgSelect, pgInsert, pgUpdate, pgDelete } from "./pgrest/postgrest";

export class ContractorSchemaRepository {
  async findAll(
    filters: Record<string, any> = {},
    select: string[] = ["*"],
    offset?: number,
    limit?: number
  ) {
    return pgSelect("contractor_schema", { ...filters, offset, limit, select });
  }

  async findById(id: string, select: string[] = ["*"]) {
    return pgSelect("contractor_schema", { id: "eq." + id, select });
  }

  async findByCompanyId(id: string, select: string[] = ["*"]) {
    return pgSelect("contractor_schema", { company_id: "eq." + id, select });
  }

  async findActiveByCompanyId(id: string, select: string[] = ["*"]) {
    return pgSelect("contractor_schema", { company_id: "eq." + id, active: "eq.true", select });
  }

  async create(siteSchemaData: any) {
    return pgInsert("contractor_schema", siteSchemaData);
  }

  async update(id: string, siteSchemaData: any) {
    return pgUpdate("contractor_schema", { id: "eq." + id }, siteSchemaData);
  }

  async delete(id: string) {
    return pgDelete("contractor_schema", { id: "eq." + id });
  }
}
