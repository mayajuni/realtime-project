export const authorizeToken = {
    description: 'jwt 권한 schema',
    type: 'object',
    properties: {
        token: {
            description: 'token',
            type: 'string'
        },
    },
    required: ['token'],
};