
import { auth } from '@/auth';
import React, { Children, ReactNode } from 'react'
import { redirect } from "next/navigation";
import "@/style/admin.css";
import Sidebar from '@/components/admin/Sidebar';
import { db } from '@/database/drizzle';
import { usersTable } from '@/database/schema';
import { eq } from 'drizzle-orm';

const layout = async ({ children }: { children: ReactNode }) => {


    const session = await auth();
    if (!session?.user?.id) redirect("/sign-in");

    const isAdmin = await db
    .select({ isAdmin: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id))
    .limit(1)
    .then((res) => res[0]?.isAdmin === "ADMIN");


  if (!isAdmin) redirect("/");
    return (
        <main className='flex min-h-screen w-full flex-row'>

            <Sidebar session={session} />
            <div className='admin-container'>

                {
                    children
                }
            </div>

        </main>
    )
}

export default layout