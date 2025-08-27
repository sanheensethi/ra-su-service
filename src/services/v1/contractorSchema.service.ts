import { dbNewContractorSchemaFactory } from "../../factory/db/contractorSchema.factory";
import logger from "../../logger/v1/logger";
import { ContractorSchemaRepository } from "../../repository/contractorSchema.repository";


class ContractorSchemaService {
    private static instance: ContractorSchemaService;
    private contractorSchemaRepository: ContractorSchemaRepository;
    constructor() {
        this.contractorSchemaRepository = new ContractorSchemaRepository();
    }

    public static getInstance(): ContractorSchemaService {
        if (!ContractorSchemaService.instance) {
            ContractorSchemaService.instance = new ContractorSchemaService();
        }
        return ContractorSchemaService.instance;
    }

    public async createContractorSchema(schemaData: any) {
        try {
            let dbData = dbNewContractorSchemaFactory(schemaData);
            const res = await this.contractorSchemaRepository.create(dbData);
            if (!res || res.success === false) {
                logger.error(`[ContractorSchemaService.createContractorSchema] creating contractor schema: ${JSON.stringify(res)}`);
                return { success: false, message: "Contractor schema not created" };
            } 
            return { success: true, data: res.data[0] };
        } catch (error: any) {
            logger.error(`[ContractorSchemaService.createContractorSchema] creating contractor schema: ${error.message} | Stack Trace: ${error.stack}`);
            throw error;
        }
    }

    public async getContractorSchemaById(id: string) {
        try {
            const res = await this.contractorSchemaRepository.findById(id);
            if (!res || res.success === false) {
                logger.warn(`[ContractorSchemaService.getContractorSchemaById] getting contractor schema: ${JSON.stringify(res)}`);
                return { success: false, message: "Contractor schema not found" };
            } 
            return { success: true, data: res.data[0] };
        } catch (error: any) {
            logger.error(`[ContractorSchemaService.getContractorSchemaById] getting contractor schema: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, message: "Contractor schema not found" };
        }
    }
}


export default ContractorSchemaService;