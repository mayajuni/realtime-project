import { Router } from '../../decorators/router.decorator';
import { Login } from '../../decorators/login.decorator';
import { Validation } from '../../decorators/validation.decorator';
import { addListSchema, idSchema, updateListSchema } from './board.json-schema';
import { socketParams } from '../../models/types/socket.types';
import { SocketError } from '../../modules/error.module';

@Router()
export class Board {
    private cursor: any;

    constructor() {
    }

    @Login()
    subscribe({send, r}: socketParams) {
        const subscribe = r.table('lists').changes().run();
        subscribe.then((cursor: any) => {
            this.cursor = cursor;
            cursor.each((err: any, data: any) => {
                if (err) {
                    throw new SocketError(err.message, 'rethinkDB', 500);
                }
                send('board', 'subscribe', data);
            });
        });
    }

    @Login()
    unsubscribe() {
        if (this.cursor) {
            this.cursor.close();
        }
    }

    @Login()
    @Validation(addListSchema)
    async addList({payload, r}: socketParams) {
        await r.table('lists').insert(payload).run();
    }

    @Login()
    @Validation(updateListSchema)
    async updateList({payload, r}: socketParams) {
        await r.table('lists').get(payload.id).update(payload).run();
    }

    @Login()
    @Validation(idSchema)
    async removeList({payload, r}: socketParams) {
        await r.table('lists').get(payload.id).delete();
    }
}