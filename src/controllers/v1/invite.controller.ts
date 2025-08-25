import express, { Request, Response } from 'express';
import logger from '../../logger/v1/logger';
import InviteService from '../../services/v1/invite.service';

class InviteController {
    private inviteService: InviteService;
    private router = express.Router();
    constructor() {
        this.initializeRoutes();
        this.inviteService = InviteService.getInstance();
    }

    private initializeRoutes() {
        this.router.post('/invite/create', this.createInvite.bind(this));
    }

    async createInvite(req: Request, res: Response) {
        // TODO: get super_admin_id from req.user after auth middleware is implemented
        const super_admin_id = 1;
        // const super_admin_id = req.user?.id; 
        // type - PLATFORM, COMPANY_MEMBER, COMPANY_OWNER
        const { email, type, base_price_up } = req.body;
        if (!email || !type) {
            return res.status(400).json({ message: "Email and Type are required" });
        }

        // by default base_price_up is 0.20 if not provided
        if (!base_price_up) {
            logger.warn(`[createInvite] base_price_up not provided, defaulting to 0.20`);
        }

        try {
            const result = await this.inviteService.createInvite({ email, type, super_admin_id: super_admin_id!, base_price_up });
            if (result.success) {
                return res.status(201).json(result.data);
            } else {
                return res.status(500).json({ message: result.details || "Failed to create invitation" });
            }
        } catch (error: any) {
            logger.error(`[UserController.createInvite] Error creating invite: ${error.message} | Stack Trace: ${error.stack}`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // async getAllInvites(req: Request, res: Response) {
    //     const super_admin_id = req.user?.id;
    //     try {
    //         const result = await this.inviteService.getAllInvites(super_admin_id!);
    //         if (result.success) {
    //             return res.status(200).json(result.data);
    //         } else {
    //             return res.status(500).json({ message: result.details || "Failed to fetch invitations" });
    //         }
    //     } catch (error: any) {
    //         logger.error(`[UserController.getAllInvites] Error fetching invites: ${error.message} | Stack Trace: ${error.stack}`);
    //         return res.status(500).json({ message: "Internal Server Error" });
    //     }
    // }

    public getRouter() {
        return this.router;
    }

};

export default InviteController;