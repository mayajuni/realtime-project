const rethinkDB = require('rethinkdbdash');

export default class InitDB {
    r: any;
    initDB: Object;

    constructor() {
        this.initDB = {
            users: {
                key: 'email'
            },
            lists: {
                index: ['order']
            }
        };
    }

    async connect() {
        const env = process.env;
        const options = {
            db: env.RETHINKDB_DB,
            host: env.RETHINKDB_HOST
        };
        this.r = rethinkDB(options);

        await this.init();
    }

    private async init() {
        const initDB: any = this.initDB;
        const r: any = this.r;
        const tableList: string[] = await r.tableList().run();

        Object.keys(initDB).forEach(async table => {
            if (!tableList.includes(table)) {
                /*
                    샤드와 리플리카셋을 구성 했으면 밑의 2개의 옵션을 추가 한다. 숫자는 구성된 갯수다.
                    shards: 3,
                    replicas: 3
                 */
                await r.tableCreate(table, {
                    primaryKey: initDB[table].key || 'id'
                }).run();
            }
            if (initDB[table].index) {
                initDB[table].index.forEach(async (index: string) => {
                    await r.table(table).indexCreate(index).run().catch(() => {
                    });
                });
            }
        });
    }
}