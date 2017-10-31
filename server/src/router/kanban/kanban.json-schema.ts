export const addListSchema = {
    description: '리스트 등록시 체크',
    type: 'object',
    properties: {
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        title: {
            description: 'title',
            type: 'string',
            minLength: 1
        },
        cards: {
            description: '아이템',
            type: 'array'
        }
    },
    required: ['kanbanId', 'title', 'cards']
};

export const updateListTitleSchema = {
    description: '리스트 title 업데이트시 체크',
    properties: {
        id: {
            description: 'id',
            type: 'string',
            minLength: 1
        },
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        title: {
            description: 'title',
            type: 'string',
            minLength: 1
        }
    },
    required: ['id', 'kanbanId', 'title']
};

export const moveListSchema = {
    description: '리스트 이동시 체크',
    properties: {
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        id: {
            description: 'id',
            type: 'string'
        },
        order: {
            description: 'order',
            type: 'number'
        }
    },
    required: ['id', 'order', 'kanbanId']
};

export const deleteListSchema = {
    description: '리스트 삭제시 체크',
    properties: {
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        id: {
            description: 'id',
            type: 'string'
        }
    },
    required: ['id', 'kanbanId']
};

export const addCardSchema = {
    description: '카드 등록시 체크',
    properties: {
        listId: {
            description: 'list id',
            type: 'string',
            minLength: 1
        },
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        title: {
            description: 'title',
            type: 'string',
            minLength: 1
        },
        order: {
            description: 'order',
            type: 'number'
        }
    },
    required: ['listId', 'kanbanId', 'title']
};

export const updateCardTitleSchema = {
    description: '카드 title 업데이트시 체크',
    properties: {
        listId: {
            description: 'list id',
            type: 'string',
            minLength: 1
        },
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        id: {
            description: 'id',
            type: 'string'
        },
        title: {
            description: 'title',
            type: 'string',
            minLength: 1
        }
    },
    required: ['listId', 'kanbanId', 'id', 'title']
};

export const moveCardSchema = {
    description: '카드 이동시 체크',
    properties: {
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        listId: {
            description: 'list id',
            type: 'string',
            minLength: 1
        },
        id: {
            description: 'id',
            type: 'string'
        },
        order: {
            description: 'order',
            type: 'number'
        },
        ...addListSchema.properties
    },
    required: ['id', 'order', 'kanbanId']
};



export const deleteCardSchema = {
    description: '카드 삭제시 체크',
    properties: {
        kanbanId: {
            description: 'kanban id',
            type: 'string',
            minLength: 1
        },
        listId: {
            description: 'list id',
            type: 'string',
            minLength: 1
        },
        id: {
            description: 'id',
            type: 'string'
        }
    },
    required: ['id', 'kanbanId', 'listId']
};
