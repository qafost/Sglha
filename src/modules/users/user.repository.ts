import { db } from "../../database/client.js";

export interface User {
    id: string;
    whatsapp_id: string;
    phone_number: string;
    name: string | null;
    timezone: string;
    created_at: Date;
    updated_at: Date;
}

export async function findUserByWhatsAppId(
    whatsappId: string
): Promise<User | null>{
    const result = await db.query<User>(
        `
        SELECT * 
        FROM users
        WHERE whatsapp_id = $1
        LIMIT 1
        `,
        [whatsappId]
    );

    return result.rows[0] ?? null;
}


export async function createUser(
    whatsappId: string,
    phoneNumber: string
): Promise<User> {
    const result = await db.query<User>(
        ` 
        INSERT INTO users (
        whatsapp_id, 
        phone_number
        )
        VALUES ($1, $2)
        RETURNING *
        `,
        [whatsappId, phoneNumber]
    );

    return result.rows[0];
}