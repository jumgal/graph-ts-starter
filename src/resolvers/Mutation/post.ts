
import { Post, Prisma } from '@prisma/client'
import { Context } from '../../index'
import { canUserMutatePost } from '../../utils/canUserMutatePost'

interface PostArgs {
    post: {
        title?: string,
        content?: string
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolvers = {
    postCreate: async (_: any, { post: { title, content } }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'Forbidden. Unauthenticated user'
                }],
                post: null
            }
        }

        if (!title || !content) {
            return {
                userErrors: [{
                    message: 'Title and Content should be provided'
                }],
                post: null
            }
        }

        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo.userId
                }
            })
        }
    },

    postUpdate: async (_: any, { postId, post }: { postId: string, post: PostArgs['post'] }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {

        const { title, content } = post

        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'Forbidden. Unauthenticated user'
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            postId: Number(postId),
            userId: userInfo.userId,
            prisma
        })

        if (error) {
            return error
        }

        if (!title && !content) {
            return {
                userErrors: [{
                    message: 'Title or Content should be provided'
                }],
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })


        if (!existingPost) {
            return {
                userErrors: [{
                    message: 'There is any post with provided id'
                }],
                post: null
            }
        }

        let payloadToUpdate = {
            title,
            content
        }

        if (!title) delete payloadToUpdate.title
        if (!content) delete payloadToUpdate.content

        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },

    postDelete: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'Forbidden. Unauthenticated user'
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            postId: Number(postId),
            userId: userInfo.userId,
            prisma
        })

        if (error) {
            return error
        }

        const postToDelete = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })


        if (!postToDelete) {
            return {
                userErrors: [{
                    message: 'There is not any post with provided id'
                }],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post: postToDelete
        }
    },

    postPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'Forbidden. Unauthenticated user'
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            postId: Number(postId),
            userId: userInfo.userId,
            prisma
        })

        if (error) {
            return error
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!existingPost || existingPost.published) {
            return {
                userErrors: [{
                    message: 'There is any post with provided id or it is already published'
                }],
                post: null
            }
        }


        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    published: true
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },
    postUnpublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {

        if (!userInfo) {
            return {
                userErrors: [{
                    message: 'Forbidden. Unauthenticated user'
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            postId: Number(postId),
            userId: userInfo.userId,
            prisma
        })

        if (error) {
            return error
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!existingPost || !existingPost.published) {
            return {
                userErrors: [{
                    message: 'There is any post with provided id or it is not published yet'
                }],
                post: null
            }
        }


        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    published: false
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    }
}