export const authorizeTokenSchema = {
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

export const userSchema = {
    description: 'userSchema',
    type: 'object',
    properties: {
        email: {
            description: '회원 이메일',
            type: 'string',
            format: 'email',
        },
        type: {
            description: '회원가입 했을시 타입(password, google, kakao, facebook)',
            type: 'string',
            enum: ['google', 'kakao', 'facebook'],
        },
    },
    required: ['email', 'type'],
    anyOf: [
        {
            properties: {
                kakaoId: {
                    description: '카카오 고유 ID',
                    type: 'string',
                },
            },
            required: ['kakaoId']
        },
        {
            properties: {
                facebookId: {
                    description: '페이스북 고유 ID',
                    type: 'string',
                },
            },
            required: ['facebookId']
        },
        {
            properties: {
                googleId: {
                    description: '구글 고유 ID',
                    type: 'string',
                },
            },
            required: ['googleId']
        }]
};