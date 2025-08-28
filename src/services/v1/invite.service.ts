import { config } from "../../config/v1/config";
import { apiInviteFactory, apiInviteUserFactory } from "../../factory/api/apiInvite.factory";
import { dbCreateCompanyOwnerInvitationFactory } from "../../factory/db/dbInvite.factory";
import logger from "../../logger/v1/logger";
import { InviteRepository } from "../../repository/invite.repository";

class InviteService {
    private static instance: InviteService;
    private inviteRepository: InviteRepository;

    constructor() {
        this.inviteRepository = new InviteRepository();
    }

    async createCompanyOwnerInvite(data: { email: string; type: string; super_admin_id: number; base_price_up?: number }): Promise<{ success: boolean; data?: any; details?: string }> {
        try {
            const { email, type, super_admin_id, base_price_up } = data;

            // Prepare invitation data
            const invitationData = dbCreateCompanyOwnerInvitationFactory({ email, type, super_admin_id, base_price_up });

            // Save the invitation to the database
            const result = await this.inviteRepository.create(invitationData);
            if (result && result.data && result.data.length > 0) {

                let apiData = apiInviteFactory(result.data[0]);
                const findResult = await this.inviteRepository.findById(apiData.id, ["*,users(id,name)"]);
                if (findResult && findResult.success && findResult.data && findResult.data.length > 0) {
                    apiData = apiInviteUserFactory(findResult.data[0]);
                }
                
                // TODO: after this, put the task into email queue to send the invitation email
                // get the invite link from config
                const inviteLink = config['inviteLinkFrontendUrl'] + invitationData.invite_code;
                logger.info(`[InviteService.createInvite] Invitation created successfully for email: ${email}, Invite Link: ${inviteLink}`);
                console.log(`Invitation created successfully for email: ${email}, Invite Link: ${inviteLink}`);
                return { success: true, data: apiData};
            } else {
                logger.error(`[InviteService.createInvite] Failed to create invitation for email: ${email} | Result: ${JSON.stringify(result)}`);
                return { success: false, details: "Failed to create invitation" };
            }
        } catch (error: any) {
            logger.error(`[InviteService.createInvite] creating invite: ${error.message} | Stack Trace: ${error.stack}`);
            return { success: false, details: "Internal Server Error" };
        }
    }

    public static getInstance(): InviteService {
        if (!InviteService.instance) {
            InviteService.instance = new InviteService();
        }
        return InviteService.instance;
    }

};

export default InviteService;