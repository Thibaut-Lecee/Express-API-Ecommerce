import {PrismaClient} from "@prisma/client";
import {encryptPassword} from "./encryptPassword";

const prisma = new PrismaClient();

interface InitializeData {
    email: string;
    password: string;
    roleId: number;
}

enum Role {
    admin = "admin",
    manager = "manager",
    client = "client",
}


const createRole = async (role: string) => {
    const findRole = await prisma.role.findUnique({
        where: {
            name: role,
        },
    });
    if (!findRole) {
        await prisma.role.create({
            data: {
                name: role,
            },
        });
        console.log(`Le role ${role} a été créé.`);
    } else {
        console.log(`Le role ${role} existe déjà.`);
    }
}

export const initializeRole = async () => {
    for (const role of Object.values(Role)) {
        await createRole(role);
    }
}


export const createAdminAccount = async (data: InitializeData) => {
    const findUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (!findUser) {
        const hashedPassword = await encryptPassword(data.password, 10)
        await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                roleId: data.roleId,
            },
        });
        console.log(`L'administrateur a été créé.`);
    } else {
        console.log(`ce compte existe déjà.`);
    }
}