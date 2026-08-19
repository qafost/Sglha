import { createUser, findUserByWhatsAppId, type User} from "./user.repository.js";

export async function findOrCreateUser(
    whatsappId: string,
    phoneNumber: string
): Promise <User> {
    const existingUser = await findUserByWhatsAppId(whatsappId);

    if(existingUser){
        return existingUser;
    };

    return createUser(whatsappId, phoneNumber);
};