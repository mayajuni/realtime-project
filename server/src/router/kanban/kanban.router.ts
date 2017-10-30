import { Router } from '../../decorators/router.decorator';
import { Validation } from '../../decorators/validation.decorator';
import { socketParams } from '../../models/types/socket.types';
import { SocketError } from '../../modules/error.module';
import { Card, List } from '../../models/interfaces/kanban.interface';
import {
    addCardSchema, addListSchema, deleteCardSchema, deleteListSchema, moveCardSchema, moveListSchema,
    updateCardTitleSchema,
    updateListTitleSchema
} from './kanban.json-schema';

@Router()
export class Kanban {
    private cursor: any;

    constructor() {
    }

    async subscribe({send, r, payload}: socketParams) {
        /* 초기 데이터를 내려준다. */
        const kanban = await r.table('kanban').get(payload.kanbanId).run();
        send('kanban', 'initLists', kanban);
        const subscribe = r.table('kanban').get(payload.kanbanId).changes().run();
        subscribe.then((cursor: any) => {
            this.cursor = cursor;
            cursor.each((err: any, data: any) => {
                if (err) {
                    throw new SocketError(err.message, 'rethinkDB', 500);
                }

                // 해당 칸반 보드에 대한 변경 사항만 있기 때문에 이렇게 처리
                if (data.new_val && data.old_val) {
                    send('kanban', 'updateKanban', data.new_val);
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
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            // card의 고유의 값
            const uuid = await r.uuid().run();

            const lists = kanban.lists || [];
            payload.id = uuid;
            payload.order = lists.length;
            payload.cards = [];
            lists.push(payload);
            return lists;
        });
    }

    @Validation(updateListTitleSchema)
    async updateListTitle({payload, r}: socketParams) {
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            const lists = kanban.lists.map((list: List) => {
                if (list.id === payload.id) {
                    list.title = payload.title;
                }

                return list;
            });
            return lists;
        });
    }

    @Validation(deleteListSchema)
    async deleteList({payload, r}: socketParams) {
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            const lists = kanban.lists
                .filter((list: List) => list.id !== payload.id)
                .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

            this.updateOrder(lists);
            return lists;
        });
    }

    @Validation(moveListSchema)
    async moveList({payload, r}: socketParams) {
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            const payloadList = kanban.lists.filter((list: List) => list.id === payload.id)[0];
            payloadList.order = payload.order;

            const lists = kanban.lists
                .filter((list: List) => list.id !== payload.id)
                .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

            lists.splice(payload.order, 0, payloadList);
            this.updateOrder(lists);
            return lists;
        });
    }

    @Validation(addCardSchema)
    async addCard({payload, r}: socketParams) {
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            // card의 고유의 값
            const uuid = await r.uuid().run();

            const lists = kanban.lists.filter((list: List) => list.id === payload.listId);
            if (!lists[0]) {
                throw new SocketError('check list id', 'Kanban addCard', 400);
            }
            const cards = lists[0].cards;

            delete payload.listId;
            payload.id = uuid;
            payload.order = cards.length;
            cards.push(payload);

            return kanban.lists;
        });
    }

    @Validation(updateCardTitleSchema)
    async updateCardTitle({payload, r}: socketParams) {
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            const lists = kanban.lists.filter((list: List) => list.id === payload.listId);
            if (!lists[0]) {
                throw new SocketError('check list id', 'Kanban addCard', 400);
            }

            lists[0].cards.map((card: Card) => {
                if (card.id === payload.id) {
                    card.title = payload.title;
                }

                return card;
            });

            return kanban.lists;
        });
    }

    @Validation(moveCardSchema)
    async moveCard({payload, r}: socketParams) {
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            const lists = kanban.lists.filter((list: List) => list.id === payload.listId);
            if (!lists[0]) {
                throw new SocketError('check list id', 'Kanban addCard', 400);
            }

            const card = lists[0].cards.filter((card: Card) => card.id === payload.id)[0];
            card.order = payload.order;

            const cards = lists[0].cards
                .filter((card: Card) => card.id !== payload.id)
                .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

            cards.splice(payload.order, 0, card);

            this.updateOrder(cards);
            return kanban.lists;
        });
    }

    @Validation(deleteCardSchema)
    async deleteCard({payload, r}: socketParams) {
        await this.updateKanbanLists(payload, r, async (kanban: any) => {
            const lists = kanban.lists.filter((list: List) => list.id === payload.listId);
            if (!lists[0]) {
                throw new SocketError('check list id', 'Kanban addCard', 400);
            }

            kanban.lists.map((list: List) => {
                if (list.id === payload.listId) {
                    const cards = list.cards
                        .filter((card: Card) => card.id !== payload.id)
                        .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

                    this.updateOrder(cards);
                    list.cards = cards;
                }

                return list;
            });

            return kanban.lists;
        });
    }

    async updateKanbanLists(payload: any, r: any, fn: Function) {
        const kanbanId = payload.kanbanId;
        const kanban = await r.table('kanban').get(kanbanId).run();
        delete payload.kanbanId;

        const lists = await fn(kanban);

        await r.table('kanban').get(kanbanId).update({lists: lists}).run();
    }

    private updateOrder(items: List[] | Card[]) {
        const itemsSize: number = items.length;

        for (let i = 0; i < itemsSize; i++) {
            const item: List | Card = items[i];
            item.order = i;
        }
    }
}