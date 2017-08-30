/**
 * Error의 메세지만으로 판단하기 힘들꺼 같아서 code와 name을 함께 쓰게 했다.
 */
export class SocketError extends Error {
    message: string;
    name: string;
    code: string | number;
    constructor(message: string, name?: string, code?: string | number) {
        super(message);
        this.message = message;
        this.name =  name;
        this.code = code;
    }
}
