
import * as Redis from "redis";

/**
 * Look for any events that have a key space notation for redis
 * @param e - string 
 * @param r - string
 */
export function KeyspaceNotif(e: any, r: any): void {

    const sub_client: Redis.createClient = new Redis.createClient();
    const expired_key: string = `__keyevent@0__:expired`;

    sub_client.subscribe(expired_key, () => {
        sub_client.on('message', async (channel: string, msg: string | any) => {
            
            const identifier: string = msg.split(":")[0];
            const second_identifier: string = msg.split(":")[1];

            switch(identifier) {
                default:
                    break;
            }

        })
    });

}
