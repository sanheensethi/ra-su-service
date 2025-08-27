import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import ContractorSchemaService from '../../services/v1/contractorSchema.service';


class ContractorSchemaController {
    private contractorSchemaService: ContractorSchemaService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.contractorSchemaService = ContractorSchemaService.getInstance();
    }

    private initializeRoutes() {
        this.router.post('/contractor-schema', this.createContractorSchema.bind(this));
        this.router.get('/contractor-schema/:id', this.getContractorSchemaById.bind(this));
    }

    private async createContractorSchema(req: Request, res: Response) {
        try {
            let { name, is_active, schema } = req.body;
            let data = await this.contractorSchemaService.createContractorSchema({ name, is_active, schema });
            if (data.success) {
                res.status(200).json({"message": "Contractor schema created successfully", "data": data.data});
            } else {
                logger.error(`[ContractorSchemaController.createContractorSchema] creating contractor schema: ${data.message}`);
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[ContractorSchemaController.createContractorSchema] creating contractor schema: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async getContractorSchemaById(req: Request, res: Response) {
        try {
            let { id } = req.params;
            let data = await this.contractorSchemaService.getContractorSchemaById(id);
            if (data.success) {
                res.status(200).json({data: data.data});
            } else {
                logger.error(`[ContractorSchemaController.getContractorSchemaById] getting contractor schema: ${data.message}`);
                res.status(400).json({ message: data.message });
            }
        } catch (error: any) {
            logger.error(`[ContractorSchemaController.getContractorSchemaById] getting contractor schema: ${error.message} | Stack Trace: ${error.stack}`);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    public getRouter() {
        return this.router;
    }

}

export default ContractorSchemaController;