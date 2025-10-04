export type PostType = {
    docId?: string,
    title: string,
    description:string,
    thumbnail: {url:string,publicId:string},
    user: { name: string, avatar: string, uid: string },
    video: {url:string,publicId:string},
    createdAt: any,
    views: number,
    likes: any,
    comments:any,
    share: any,
} | null;

export type LikedType = {
    docId?: string,
    postId: string,
    createdAt?: any,
    name: string,
    avatar: string,
    uid:string,
}
export type CommentType = {
    docId: string,
    postId: string,           
    comment: string,             
    createdAt: any,     
    updatedAt?: any,   
    uid: string,           
    name: string,
    avatar: string,
}

export type ShareType = {}
export type ViewType = LikedType