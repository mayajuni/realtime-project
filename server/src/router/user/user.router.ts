import { Router } from '../../decorators/router.decorator';
import { Validation } from '../../decorators/validation.decorator';
import { authorizeToken } from './user.json-schema';
import { verify } from 'jsonwebtoken';
import { socketParams } from '../../models/types/socket.types';

@Router()
export default class User {
    constructor() {
    }

    @Validation(authorizeToken)
    authorizeToken({ws, payload, send}: socketParams) {
        const token = payload.token;

        const userInfo = verify(token, process.env.JWT_KEY);
        // 로그인 된 정보는 ws.user에 저장 된다.
        ws.user = userInfo;
        // route, action, payload로 구성 되어 있다.
        send('user', 'setUserInfo', ws.user);
    }

    register() {

    }
}
