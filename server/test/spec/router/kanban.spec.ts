import * as WebSocket from 'uws';
import * as chai from 'chai';
import * as dotenv from 'dotenv';
import { join } from 'path';
import InitDB from '../../../src/db/index';
import { expect } from 'chai';
import { Card, List } from '../../../src/models/interfaces/kanban.interface';

chai.should();

dotenv.config({
    path: join(__dirname, '..', '..', '..', '.env')
});

const url = 'ws://localhost:3000';
let r: any = '';
let ws: any;
let kanbanId = '';
let listId = '';
let cardId = '';
const cardListId = '123';

const initLists: any[] = [
    {
        id: cardListId,
        title: 'test1',
        order: 0,
        cards: [
            {id: 1234, title: 'testCard1', order: 0},
            {id: 12324, title: 'testCard2', order: 1}
        ]
    },
    {
        id: '123555',
        title: 'test2',
        order: 1,
        cards: []
    }
];

const connectDB = async () => {
    const db = new InitDB();
    await db.connect();
    r = db.r;
};

const connectWs = (fn: any) => {
    if (ws) {
        ws.close();
    }
    ws = new WebSocket(url, 'echo-protocol');

    ws.onopen = async () => await fn();
};

const checkAndDone = (done: any, kanbanId: string, fn: Function) => {
    const subscribe = r.table('kanban').get(kanbanId).changes().run();
    subscribe.then((cursor: any) => {
        cursor.each((err: any, data: any) => {
            try {
                fn(data.new_val.lists);
                cursor.close();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
};

describe('Kanban Test', () => {
    before(done => {
        connectDB().then(() => {
            r.table('kanban').insert({lists: initLists, title: 'test'}).run().then((result: any) => {
                kanbanId = result.generated_keys[0];
                done();
            });
        });
    });

    it('subscribe', done => {
        connectWs(() => {
            ws.send(JSON.stringify({route: 'Kanban', action: 'subscribe', payload: {kanbanId}}));

            ws.onmessage = (event: any) => {
                ws.send(JSON.stringify({route: 'Kanban', action: 'unsubscribe'}));
                const params = JSON.parse(event.data);
                params.route.should.equal('kanban');
                params.action.should.equal('initLists');
                ws.close();
                done();
            };
        });
    });

    it('add list', done => {
        const payload: any = {
            kanbanId: kanbanId,
            title: Date.now().toString(),
            cards: []
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const lists = kanbanLists.filter((list: List) => list.title === payload.title);
                expect(lists[0]).to.be.not.undefined;
                listId = lists[0].id;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'addList', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });

    it('update list title', done => {
        const payload: any = {
            kanbanId: kanbanId,
            id: listId,
            title: Date.now().toString()
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const lists = kanbanLists.filter((list: List) => list.title === payload.title);
                expect(lists[0]).to.be.not.undefined;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'updateListTitle', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });

    it('move list', done => {
        const payload: any = {
            kanbanId: kanbanId,
            id: listId,
            order: 0
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const lists = kanbanLists.sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);
                expect(lists[0].id === listId).to.be.true;
                expect(lists[1].id === initLists[0].id).to.be.true;
                expect(lists[2].id === initLists[1].id).to.be.true;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'moveList', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });

    it('delete list', done => {
        const payload: any = {
            kanbanId: kanbanId,
            id: listId,
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const lists = kanbanLists.filter((list: List) => list.id === listId);
                expect(lists[0]).to.be.undefined;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'deleteList', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });

    it('add card', done => {
        const payload: any = {
            kanbanId: kanbanId,
            listId: cardListId,
            title: Date.now().toString()
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const list = kanbanLists.filter((list: List) => list.id === payload.listId)[0];
                expect(list).to.be.not.undefined;
                const card = list.cards.filter((card: Card) => card.title === payload.title)[0];
                expect(card).to.be.not.undefined;
                cardId = card.id;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'addCard', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });

    it('update card title', done => {
        const payload: any = {
            kanbanId: kanbanId,
            listId: cardListId,
            id: cardId,
            title: Date.now().toString()
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const list = kanbanLists.filter((list: List) => list.id === payload.listId)[0];
                expect(list).to.be.not.undefined;
                const card = list.cards.filter((card: Card) => card.title === payload.title)[0];
                expect(card).to.be.not.undefined;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'updateCardTitle', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });

    it('move card', done => {
        const payload: any = {
            kanbanId: kanbanId,
            listId: cardListId,
            id: cardId,
            order: 0
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const list = kanbanLists.filter((list: List) => list.id === payload.listId)[0];
                expect(list).to.be.not.undefined;
                const cards = list.cards.sort((a: any, b: any) => a.order < b.order ? -1 : a.order > b.order ? 1 : 0);
                expect(cards[0].id === cardId).to.be.true;
                expect(cards[1].id === initLists[0].cards[0].id).to.be.true;
                expect(cards[2].id === initLists[0].cards[1].id).to.be.true;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'moveCard', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });


    it('delete list', done => {
        const payload: any = {
            kanbanId: kanbanId,
            listId: cardListId,
            id: cardId
        };

        connectWs(async () => {
            checkAndDone(done, kanbanId, (kanbanLists: any[]) => {
                const list = kanbanLists.filter((list: List) => list.id === payload.listId)[0];
                expect(list).to.be.not.undefined;

                const card = list.cards.filter((card: Card) => card.id === cardId)[0];
                expect(card).to.be.undefined;
            });

            ws.send(JSON.stringify({route: 'Kanban', action: 'deleteCard', payload}));

            ws.onmessage = (event: any) => done(JSON.parse(event.data).payload.error);
        });
    });

    after(done => {
        r.table('kanban').get(kanbanId).delete().run().then((result: any) => {
            done();
        });
    });
});