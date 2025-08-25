// repositories/user.repository.ts
import { pgSelect } from "./pgrest/postgrest";

export class UserRepository {
  async findById(id: string, select: string[] = ["*"]) {
    return pgSelect("users", { id: "eq." + id, select });
  }
}
