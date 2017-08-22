/**
 * 에러 처리를 하기 위한 코드
 *
 * @param fn
 */
export const wrap = (fn: any) => (req: any, res: any, next: any) => fn(req, res, next).catch(next);