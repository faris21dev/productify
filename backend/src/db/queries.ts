import {db} from './index';
import { eq } from 'drizzle-orm';
import { users, products, comments, type newUser, type newProduct, type newComment } from './schema';

// Users Queries
export const createUser = async (data: newUser) => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
};

export const getUserById = async (id: string) => {
    return await db.query.users.findFirst({where: eq(users.id, id)});
};

export const updateUser = async (id: string, data: Partial<newUser>) => {

    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
};

export const upsertUser = async (data: newUser) => {
    const [user] = await db
        .insert(users)
        .values(data)
        .onConflictDoUpdate({
            target: users.id,
            set: {
                email: data.email,
                name: data.name,
                imageUrl: data.imageUrl,
                updatedAt: new Date(),
            },
        })
        .returning();
    return user;
}

// Products Queries
export const createProduct = async (data: newProduct) => {
    const [product] = await db.insert(products).values(data).returning();
    return product;
};

export const getProductById = async (id: string) => {
    return await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            user: true,
            comments: {
                with: {user: true},
                orderBy: (comments, {desc}) => [desc(comments.createdAt)]
            }
        }
    });
};

export const getAllProducts = async () => {
    return await db.query.products.findMany({
        with: {user: true},
        orderBy: (products, {desc}) => [desc(products.createdAt)]
    });
};

export const getProductsByUserId = async (userId: string) => {
    return await db.query.products.findMany({
        where: eq(products.userId, userId),
        with: {user: true},
        orderBy: (products, {desc}) => [desc(products.createdAt)]
    })
};

export const updateProduct = async (id: string, data: Partial<newProduct>) => {
    const existingProduct = await db.query.products.findFirst({where: eq(products.id, id)});
    if (!existingProduct) {
        throw new Error('Product not found');
    }

    const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return product;
};

export const deleteProduct = async (id: string) => {
    const existingProduct = await db.query.products.findFirst({where: eq(products.id, id)});
    if (!existingProduct) {
        throw new Error('Product not found');
    }

    const [product] = await db.delete(products).where(eq(products.id, id)).returning();
    return product;
};

// Comments Queries
export const createComment = async (data: newComment) => {
    const [comment] = await db.insert(comments).values(data).returning();
    return comment;
};

export const deleteComment = async (id: string) => {
    const existingComment = await db.query.comments.findFirst({where: eq(comments.id, id)});
    if (!existingComment) {
        throw new Error('Comment not found');
    }

    const [comment] = await db.delete(comments).where(eq(comments.id, id)).returning();
    return comment;
};

export const getCommentById = async (id: string) => {
    return await db.query.comments.findFirst({
        where: eq(comments.id, id),
        with: {
            user: true
        }
    })
}