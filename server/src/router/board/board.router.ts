import {Router} from '../../decorators/router.decorator';
import {Validation} from '../../decorators/validation.decorator';
import {addListSchema, idSchema, moveListSchema, updateListSchema} from './board.json-schema';
import {socketParams} from '../../models/types/socket.types';
import {SocketError} from '../../modules/error.module';

@Router()
export class Board {
    private cursor: any;

    constructor() {
    }

    async subscribe({send, r}: socketParams) {
        /* 초기 데이터를 내려준다. */
        const lists = await r.table('lists').orderBy('order').run();
        send('bard', 'initLists', lists);

        const subscribe = r.table('lists').changes().run();
        subscribe.then((cursor: any) => {
            this.cursor = cursor;
            cursor.each((err: any, data: any) => {
                if (err) {
                    throw new SocketError(err.message, 'rethinkDB', 500);
                }

                if (data.new_val && !data.old_val) {
                    send('board', 'addList', data.new_val);
                } else if (data.new_val && data.old_val) {
                    send('board', 'updateList', data.new_val);
                } else {
                    send('board', 'removeList', data.old_val.id);
                }
            });
        });
    }

    unsubscribe() {
        if (this.cursor) {
            this.cursor.close();
        }
    }

    @Validation(addListSchema)
    async addList({payload, r}: socketParams) {
        await r.table('lists').insert(payload).run();
    }

    @Validation(moveListSchema)
    async moveList({payload, r}: socketParams) {
        const lists = await r.table('lists').orderBy('order').run();
        const listsSize = lists.length;

        lists.splice(payload.oldOrder, 1);
        lists.splice(payload.order, 0, payload);

        for (let i = 0; i < listsSize; i++) {
            const list = lists[i];
            list.order = i;

            await r.table('lists').get(list.id).update(list).run();
        }
    }

    @Validation(updateListSchema)
    async updateList({payload, r}: socketParams) {
        await r.table('lists').get(payload.id).update(payload).run();
    }

    @Validation(idSchema)
    async removeList({payload, r}: socketParams) {
        await r.table('lists').get(payload.id).delete();
        await this.updateListOrder(r);
    }

    async updateListOrder (r: any) {
        const lists = await r.table('lists').orderBy('order').run();
        const listsSize = lists.length;

        for (let i = 0; i < listsSize; i++) {
            const list = lists[i];
            list.order = i;

            await r.table('lists').get(list.id).update(list).run();
        }
    }
}