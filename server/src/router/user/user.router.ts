import { Router } from '../../decorators/router.decorator';
import { Validation } from '../../decorators/validation.decorator';
import { authorizeTokenSchema, userSchema } from './user.json-schema';
import { sign, verify } from 'jsonwebtoken';
import { socketParams } from '../../models/types/socket.types';
import { SocketError } from '../../modules/error.module';

@Router()
export default class User {
    constructor() {
    }

    @Validation(authorizeTokenSchema)
    authorizeToken({ws, payload, send}: socketParams) {
        try {
            const token = payload.token;

            const userInfo = verify(token, process.env.JWT_KEY);
            // 로그인 된 정보는 ws.user에 저장 된다.
            ws.user = userInfo;
            // route, action, payload로 구성 되어 있다.
            send('user', 'setUserInfo', {user: ws.user, token: token});
        } catch (error) {
            throw new SocketError('wrong token', 'authorize', 401);
        }
    }

    /**
     * sns 로그인만 제공하면 가입된 이력이 없으면 가입을 시켜준다.
     *
     * @param {WebSocket} ws
     * @param {any} payload
     * @param {send} send
     * @param {any} r
     * @returns {Promise<void>}
     */
    @Validation(userSchema)
    async login({ws, payload, send, r}: socketParams) {
        const email = payload.email;
        const userTable = r.table('users');
        const type = payload.type;
        const key = `${type}Id`;
        if (!payload[key]) {
            throw new SocketError('check the sns id.', 'login', 401);
        }

        const user = await userTable.get(email).run();

        if (!user) {
            // 사용자가 없으면 회원 가입 시켜버린다.
            await userTable.insert(payload).run();
        } else {
            // 사용자가 있어서 로그인 처리
            if (user[key] !== payload[key]) {
                throw new SocketError('Email is in use.', 'login', 401);
            }
        }

        ws.user = {email: payload.email};
        const token = sign(ws.user, process.env.JWT_KEY);

        send('user', 'setUserInfo', {user: ws.user, token: token});
    }
}
