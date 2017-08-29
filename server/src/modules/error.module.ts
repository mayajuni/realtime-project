/**
 * 무언가 값이 없을시 쓰는 에러다.
 */
export class NullPointError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NullPointError';
    }
}

/**
 * 라우터를 찾을 수 없을때 쓰는 에러다.
 */
export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}

/**
 * validation 에러
 */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
