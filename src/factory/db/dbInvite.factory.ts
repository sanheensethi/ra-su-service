// It should return an object that matches the database schema for user
import tokenService from "../../utils/tokens";

export function dbCreateCompanyOwnerInvitationFactory(data: any) {
    let { email, type, super_admin_id, base_price_up } = data;
    
    return {
        email: email,
        invite_code: tokenService.generateRandomToken(16),
        invitation_type: type,
        invited_by: super_admin_id,
        role_in_company: "ADMIN",
        status: "PENDING",
        expire_time: new Date(new Date().getTime() + 7*24*60*60*1000).toISOString(), // 7 days from now
        base_price_up: base_price_up ?? 0.20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
}