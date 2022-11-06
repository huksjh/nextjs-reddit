import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from "../entities/User";

/**
 * 회원가입
 * @param req
 * @param res
 */
const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    console.log("email", email);

    try {
        let errors: any = {};

        // 이메일과 유저이름 유효성 검사
        const emailUser = await User.findOneBy({ email });
        const usernameUser = await User.findOneBy({ username });

        // 이메일 있으면 error 담기
        if (emailUser) errors.email = "이미 해당 이메일 주소가 사용중입니다.";
        if (usernameUser) errors.username = "이미 해당 이름이 사용중입니다.";

        // 에러가 있으면 리턴
        // if (Object.keys(errors).length > 0) {
        //     return res.status(400).json(errors);
        // }

        const user = new User();
        user.email = email;
        user.username = username;
        user.password = password;

        const mapErrors = (errors: Object[]) => {
            return errors.reduce((prev: any, err: any) => {
                // console.log(Object.entries(err.constraints));
                prev[err.property] = Object.entries(err.constraints)[0][1];
                return prev;
            }, {});
        };

        // user 정보 유효성 검사
        errors = await validate(user);
        if (errors.length > 0) {
            // console.log(mapErrors(errors));
            return res.status(400).json(mapErrors(errors));
        }

        await user.save();
        return res.json(user);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error });
    }
};

const router = Router();
router.post("/register", register);

export default router;
