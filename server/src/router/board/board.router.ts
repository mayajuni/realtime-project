import { Router } from '../../decorators/router.decorator';
import { Validation } from '../../decorators/validation.decorator';
import {
    addCardSchema, addListSchema, idsCardSchema, idSchema, moveCardSchema, moveListSchema, updateCardSchema,
    updateListSchema
} from './board.json-schema';
import { socketParams } from '../../models/types/socket.types';
import { SocketError } from '../../modules/error.module';
import { Card, List } from '../../models/interfaces/board.interface';

@Router()
export class Board {
    private cursor: any;

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
        const count = await r.table('lists').get(payload.id).count().run();
        if (count < 1) {
            throw new SocketError('check list id', 'board moveList', 400);
        }

        const oldlists = await r.table('lists').orderBy('order').run();
        const lists = oldlists.filter((list: List) => list.id !== payload.id);

        lists.splice(payload.order, 0, payload);

        const listsSize = lists.length;
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

    async updateListOrder(r: any) {
        const lists = await r.table('lists').orderBy('order').run();
        const listsSize = lists.length;

        for (let i = 0; i < listsSize; i++) {
            const list = lists[i];
            list.order = i;

            await r.table('lists').get(list.id).update(list).run();
        }
    }

    @Validation(addCardSchema)
    async addCard({payload, r}: socketParams) {
        const listId = payload.listId;
        const list = await r.table('lists').get(listId).run();
        // card의 고유의 값
        const uuid = await r.uuid().run();
        delete payload.listId;

        let cards = [];
        if (list.cards) {
            // card sort 한다.
            cards = list.cards.sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);
            payload.id = uuid;
            cards.splice(payload.order, 0, payload);
            this.updateCardOrder(cards);

        } else {
            cards.push(payload);
        }

        await r.table('lists').get(listId).update({cards: cards}).run();
    }

    @Validation(idsCardSchema)
    async removeCard({payload, r}: socketParams) {
        const listId = payload.listId;
        const list = await r.table('lists').get(listId).run();
        // card 삭제 후 sort 한다.
        const cards = list.cards
            .filter((card: Card) => card.id !== payload.id)
            .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

        this.updateCardOrder(cards);

        await r.table('lists').get(listId).update({cards: cards}).run();
    }

    @Validation(moveCardSchema)
    async moveCard({payload, r}: socketParams) {
        const listId = payload.listId;
        const list = await r.table('lists').get(listId).run();
        if (!list) {
            throw new SocketError('check list id', 'board moveCard', 400);
        }
        const oldCards = list.cards;
        const checkCardId = oldCards.filter((card: Card) => card.id === payload.id).length < 1;
        if (checkCardId) {
            throw new SocketError('check card id', 'board moveCard', 400);
        }

        const cards = oldCards
            .filter((card: Card) => card.id !== payload.id)
            .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

        cards.splice(payload.order, 0, payload);
        this.updateCardOrder(cards);
        await r.table('lists').get(listId).update({cards: cards}).run();
    }

    @Validation(updateCardSchema)
    async updateCard({payload, r}: socketParams) {
        const listId = payload.listId;
        const list = await r.table('lists').get(listId).run();
        if (!list) {
            throw new SocketError('check list id', 'board updateCard', 400);
        }

        const cards = list.cards.map((card: Card) => {
            if (card.id === payload.id) {
                delete payload.listId;
                card = payload;
            }

            return card;
        });

        await r.table('lists').get(listId).update({cards: cards}).run();
    }

    updateCardOrder(cards: Card[]) {
        const cardsSize: number = cards.length;

        for (let i = 0; i < cardsSize; i++) {
            const card: Card = cards[i];
            card.order = i;
        }
    }
}