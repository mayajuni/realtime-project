import { Router } from '../../decorators/router.decorator';
import { Validation } from '../../decorators/validation.decorator';
import { authorizeToken, register } from './user.json-schema';
import { sign, verify } from 'jsonwebtoken';
import { socketParams } from '../../models/types/socket.types';
import { SocketError } from '../../modules/error.module';
import { encrypt } from '../../modules/crypto.module';

@Router()
export default class User {
    constructor() {
    }

    @Validation(authorizeToken)
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
     * 회원 가입
     * sns로 가입을 요청이 들어 왔을경우 가입이 되어있는 계정이면 자동로그인을 해준다.
     *
     * @param {WebSocket} ws
     * @param {any} payload
     * @param {send} send
     * @param {any} r
     * @returns {Promise<void>}
     */
    @Validation(register)
    async register({ws, payload, send, r}: socketParams) {
        const email = payload.email;
        const userTable = r.table('users');

        const user = await userTable.get(email).run();
        if (user) {
            throw new SocketError('has-email', 'register', 422);
        }

        payload.password = payload.password ? encrypt(payload.password, process.env.PASSWORD_KEY) : '';

        await userTable.insert(payload).run();

        ws.user = {name: payload.name, email: payload.email};
        const token = sign(ws.user, process.env.JWT_KEY);

        send('user', 'setUserInfo', {user: ws.user, token: token});
    }
}
