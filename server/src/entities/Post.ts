import { Exclude, Expose } from "class-transformer";
import { text } from "stream/consumers";
import { BeforeInsert, Column, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { makeId, slugify } from "../utils/helpers";
import BaseEntity from "./Entity";
import Sub from "./Sub";
import User from "./User";
import Vote from "./Vote";

export default class Post extends BaseEntity {
    @Index()
    @Column()
    identifier: string;

    // 제목
    @Column()
    title: string;

    // 페이지나, 포스트를 설명하는 핵심단어의 집합이다.
    // url 만들때 사용
    @Index()
    @Column()
    slug: string;

    // nullable 값이 없어도 등록가능하게
    @Column({ nullable: true, type: "text" })
    body: string;

    //
    @Column()
    subNname: string;

    // 포스트 만든사람 이름
    @Column()
    username: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user: User;

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({ name: "subName", referencedColumnName: "name" })
    sub: Sub;

    // Exclude 리턴값에서 제외
    @Exclude()
    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    // Exclude 리턴값에서 제외
    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.post)
    votes: Vote[];

    // 게시물 url 생성
    @Expose() get url(): string {
        return `/r/${this.subNname}/${this.identifier}/${this.slug}`;
    }

    // 댓글 개수 구하기
    @Expose() get commentCount(): number {
        return this.comments?.length;
    }

    @Expose() get VoteScore(): number {
        return this.votes?.reduce((memo, curt) => (memo) => curt.value || 0, 0);
    }

    protected userVote: member;

    setUserVote(user: User) {
        const index = this.votes?.findIndex((v) => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7);
        this.slug = slugify(this.title);
    }
}
