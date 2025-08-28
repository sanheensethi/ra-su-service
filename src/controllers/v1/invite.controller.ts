import express, { Request, Response, Router } from "express";
import logger from "../../logger/v1/logger";
import InviteService from "../../services/v1/invite.service";
import { validateInvitationTypeInputs } from "../../utils/helpers";

class InviteController {
    private inviteService: InviteService;
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.inviteService = InviteService.getInstance();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/invite/create", this.createInvite.bind(this));
    }

    private async createInvite(req: Request, res: Response): Promise<Response> {
        try {
            // TODO: Replace with req.user?.id once auth middleware is implemented
            const super_admin_id = 1;

            const { email, type, base_price_up } = req.body;

            if (!email || !type) {
                return res.status(400).json({ message: "Email and Type are required" });
            }

            const validation = validateInvitationTypeInputs(type, req.body);
            if (!validation.success) {
                return res.status(400).json({ message: validation.message });
            }

            // Default base_price_up
            const finalBasePriceUp = base_price_up ?? 0.0;
            if (base_price_up === undefined) {
                logger.warn(`[InviteController.createInvite] base_price_up not provided, defaulting to ${finalBasePriceUp}`);
            }

            let result;
            switch (type) {
                case "COMPANY_OWNER":
                    result = await this.handleCompanyOwnerInvite({ email, type, super_admin_id, base_price_up: finalBasePriceUp });
                    break;

                // If you want to add other invite types later (PLATFORM, COMPANY_MEMBER, etc.)
                default:
                    return res.status(400).json({ message: `Unsupported invite type: ${type}` });
            }

            if (result.success) {
                return res.status(201).json(result.data);
            }

            return res.status(500).json({ message: result.details || "Failed to create invitation" });

        } catch (error: any) {
            logger.error(`[InviteController.createInvite] Error: ${error.message} | Stack: ${error.stack}`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    private async handleCompanyOwnerInvite(params: {
        email: string;
        type: string;
        super_admin_id: number;
        base_price_up: number;
    }) {
        try {
            return await this.inviteService.createCompanyOwnerInvite(params);
        } catch (error: any) {
            logger.error(`[InviteController.handleCompanyOwnerInvite] Error: ${error.message} | Stack: ${error.stack}`);
            return { success: false, details: "Failed to create company owner invitation" };
        }
    }

    public getRouter(): Router {
        return this.router;
    }
}

export default InviteController;
