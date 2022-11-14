import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

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
        console.log("usernameUser", usernameUser);
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
        console.log("errors length", errors.length);
        if (errors.length > 0) {
            console.log(mapErrors(errors));
            return res.status(400).json(mapErrors(errors));
        }

        await user.save();
        //return res.json(user);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ error });
    }
};

/**
 * 로그인
 * @param req
 * @param res
 * @returns
 */
const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    //console.log("email", email);
    //console.log("password", password);
    try {
        let errors: any = {};
        // 입력값 존재 여부
        if (isEmpty(email)) errors.email = "이메일주소는 필수 입력 항목입니다.";
        if (isEmpty(password)) errors.password = "비밀번호는 필수 입력 항목입니다.";
        // 오류 객체가 존재 하면 에러값 리턴
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        // 디비에서 유저 찾기
        const user = await User.findOneBy({ email });
        // 유저가 존재 하지 않다면 에러 리턴
        if (!user) return res.status(400).json({ email: "이메일 주소가 존재하지 않습니다." });

        // 이메일 주소가 존재하면 비밀번호 검사
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ password: "비밀번호가 잘못되었습니다" });
        }

        // 비밀번호 일치 => 토큰생성
        const token = jwt.sign({ email }, process.env.JWT_SECRET);

        // 쿠키생성
        res.set(
            "Set-Cookie",
            cookie.serialize("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // 1주일
                path: "/",
            })
        );
        return res.json({ user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
export default router;
