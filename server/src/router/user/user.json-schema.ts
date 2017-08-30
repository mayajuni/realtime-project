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

export const register = {
    description: '회원가입',
    type: 'object',
    properties: {
        email: {
            description: '회원 이메일',
            type: 'string',
            format: 'email',
        },
        name: {
            description: '이름 혹은 닉네임',
            type: 'string',
        }
    },
    required: ['email', 'name'],
    anyOf: [
        {
            properties: {
                password: {
                    description: '비밀번호',
                    type: 'string',
                },
            },
            required: ['password']
        },
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