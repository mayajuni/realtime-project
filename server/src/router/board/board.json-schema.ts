export const idSchema = {
    description: 'rethinkDB의 키값',
    type: 'object',
    properties: {
        id: {
            description: 'id',
            type: 'string'
        },
    },
    required: ['id'],
};

export const addListSchema = {
    description: '리스트 등록시 체크',
    type: 'object',
    properties: {
        title: {
            description: 'title',
            type: 'string',
            minLength: 1
        },
        order: {
            description: '순서',
            type: 'number'
        },
        cards: {
            description: '아이템',
            type: 'array'
        },
    },
    required: ['title', 'order', 'cards'],
};

export const updateListSchema = {
    description: '리스트 업데이트시 체크, addList와 id를 합쳐서 쓴다.',
    properties: {...addListSchema.properties, ...idSchema.properties},
    required: [...addListSchema.required, ...idSchema.required]
};

export const moveListSchema = {
    description: '리스트 업데이트시 체크, addList와 id를 합쳐서 쓴다.',
    properties: {
        ...idSchema.properties,
        order: {
            description: '순서',
            type: 'number'
        }
    },
    required: [...idSchema.required, 'order']
};

export const addCardSchema = {
    description: '카드 등록시 체크',
    type: 'object',
    properties: {
        listId: {
            description: 'list id',
            type: 'string',
            minLength: 1
        },
        title: {
            description: 'title',
            type: 'string',
            minLength: 1
        },
        order: {
            description: '순서',
            type: 'number'
        }
    },
    required: ['listId', 'title', 'order']
};

export const idsCardSchema = {
    description: '카드 등록시 체크',
    type: 'object',
    properties: {
        listId: {
            description: 'list id',
            type: 'string',
            minLength: 1
        },
        id: {
            description: 'card id',
            type: 'string',
            minLength: 1
        }
    },
    required: ['listId', 'id']
};

export const updateCardSchema = {
    description: '카드드 업데이트시 체크, addCardSchema와 idsCardSchema를 합쳐서 쓴다.',
    properties: {...addCardSchema.properties, ...idsCardSchema.properties},
    required: [...addCardSchema.required, 'id']
};

export const moveCardSchema = {
    description: '카드 순서가 변경 됐을시 체크',
    type: 'object',
    properties: {
        listId: {
            description: 'list id',
            type: 'string',
            minLength: 1
        },
        id: {
            description: 'card id',
            type: 'string',
            minLength: 1
        },
        order: {
            description: '순서',
            type: 'number'
        }
    },
    required: ['listId', 'id', 'order']
};