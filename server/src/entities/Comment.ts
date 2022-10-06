import { Exclude, Expose } from "class-transformer";
import { BaseEntity, Column, Index, Entity, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from "typeorm";
import { makeId, slugify } from "../utils/helpers";
import Post from "./Post";
import User from "./User";
import Vote from "./Vote";

/**
 * 댓글 테이블
 * id, createdAt, updatedAt, identifier, body, username, postId
 */

@Entity("comments")
export default class Comment extends BaseEntity {
    /*
     * BaseEntity 통해서
     * 기본  id, createdAt, updatedAt 3가지는 포함시킴
     */
    @Index()
    @Column()
    identifier: string;

    @Column()
    body: string;

    @Column()
    username: string;

    // 다대일 작성한 사람
    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;

    @Column()
    postId: number;

    // 다대일
    @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
    post: Post;

    // 제외
    @Exclude()
    // 일대다
    @OneToMany(() => Vote, (vote) => vote.comment)
    votes: Vote[];

    protected userVote: number;

    setUserVote(user: User) {
        const index = this.votes?.findIndex((v) => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @Expose() get voteScore(): number {
        const initialValue = 0;
        return this.votes?.reduce((prev, curr) => prev + curr.value || 0, initialValue);
    }

    @BeforeInsert()
    makeId() {
        this.identifier = makeId(8);
    }
}
