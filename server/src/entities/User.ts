import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import BaseEntity from "./Entity";
import bcrypt from "bcryptjs";

import Post from "./Post";
import Vote from "./Vote";
/**
 * User 테이블
 * id, createdAt, updatedAt, email, username, password, posts, votes,
 */

@Entity("users")
export default class User extends BaseEntity {
    /*
     * BaseEntity 통해서
     * 기본  id, createdAt, updatedAt 3가지는 포함시킴
     */

    // 이메일 주소
    @Index()
    @IsEmail(undefined, { message: "이메일 주소가 잘못되었습니다." })
    @Length(1, 255, { message: "이메일 주소는 필수항목 입니다." })
    @Column({ unique: true })
    email: string;

    // 사용자이름
    @Index()
    @Length(3, 32, { message: "사용자 이름은 3자 이상이어야 합니다." })
    @Column({ unique: true })
    username: string;

    // 비밀번호
    @Exclude()
    @Column()
    @Length(6, 255, { message: "비밀번호는 6자리 이상이어야 합니다" })
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    // 등록전 비밀번호 변환
    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6);
    }
}
