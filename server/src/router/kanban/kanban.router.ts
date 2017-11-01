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

    async subscribe({send, r}: socketParams) {
        // 초기 데이터를 내려준다. 초기버전은 카반보드가 1개만 있는 버젼이다. 카반이 없으면 insert로 만들어고 있으면 있는 것을 내려준다.
        const kanbans = await r.table('kanban').run();
        let kanban = kanbans[0];
        if (kanbans.length === 0) {
            kanban = {title: 'init', lists: []};
            const result = await r.table('kanban').insert(kanban);
            kanban.id = result.generated_keys[0];
        }
        send('kanban', 'initKanban', kanban);
        const subscribe = r.table('kanban').get(kanban.id).changes().run();
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
        await this.updateKanbanCards(payload, r, async (kanban: any, list: List) => {
            // card의 고유의 값
            const uuid = await r.uuid().run();
            const cards = list.cards;

            payload.id = payload.id ? payload.id : uuid;
            cards.splice(payload.order ? payload.order : 0, 0, payload);
            this.updateOrder(cards);

            return list;
        });
    }

    @Validation(updateCardTitleSchema)
    async updateCardTitle({payload, r}: socketParams) {
        await this.updateKanbanCards(payload, r, async (kanban: any, list: List) => {
            list.cards.map((card: Card) => {
                if (card.id === payload.id) {
                    card.title = payload.title;
                }

                return card;
            });

            return list;
        });
    }

    @Validation(moveCardSchema)
    async moveCard({payload, r}: socketParams) {
        await this.updateKanbanCards(payload, r, async (kanban: any, list: List) => {
            const card = list.cards.filter((card: Card) => card.id === payload.id)[0];
            card.order = payload.order;

            const cards = list.cards
                .filter((card: Card) => card.id !== payload.id)
                .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

            cards.splice(payload.order, 0, card);

            this.updateOrder(cards);

            return list;
        });
    }

    @Validation(deleteCardSchema)
    async deleteCard({payload, r}: socketParams) {
        await this.updateKanbanCards(payload, r, async (kanban: any, list: List) => {
            const cards = list.cards
                .filter((card: Card) => card.id !== payload.id)
                .sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);

            this.updateOrder(cards);

            list.cards = cards;

            return list;
        });
    }

    private async updateKanbanLists(payload: any, r: any, fn: Function) {
        const kanbanId = payload.kanbanId;
        const kanban = await r.table('kanban').get(kanbanId).run();
        delete payload.kanbanId;

        const lists = await fn(kanban);

        await r.table('kanban').get(kanbanId).update({lists: lists}).run();
    }

    private async updateKanbanCards(payload: any, r: any, fn: Function) {
        const kanbanId = payload.kanbanId;
        const kanban = await r.table('kanban').get(kanbanId).run();
        delete payload.kanbanId;

        const listId = payload.listId;
        delete payload.listId;

        const lists = kanban.lists.filter((list: List) => list.id === listId);
        if (!lists[0]) {
            throw new SocketError('check list id', 'Kanban addCard', 400);
        }

        const list = await fn(kanban, lists[0]);

        await r.table('kanban').get(kanban.id)
            .update((row: any) => ({lists: row('lists').filter((client: any) => client('id').ne(listId)).append(list)})).run();
    }

    private updateOrder(items: List[] | Card[]) {
        const itemsSize: number = items.length;

        for (let i = 0; i < itemsSize; i++) {
            const item: List | Card = items[i];
            item.order = i;
        }
    }
}