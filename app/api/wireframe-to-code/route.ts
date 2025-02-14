import { db } from "@/configs/db";
import { usersTable, WireframeToCodeTable } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { description, imageUrl, model, uid, email } = await req.json();

    const creditResult = await db.select().from(usersTable)
        .where(eq(usersTable.email, email));

    if (creditResult[0]?.credits && creditResult[0]?.credits > 0) {

        const result = await db.insert(WireframeToCodeTable).values({
            uid: uid.toString(),
            description: description,
            imageUrl: imageUrl,
            model: model,
            createdBy: email
        }).returning({ id: WireframeToCodeTable.id });

        // Update user credits
        const data = await db.update(usersTable).set({
            credits: creditResult[0]?.credits - 1
        }).where(eq(usersTable.email, email));

        return NextResponse.json(result);
    }
    else {
        return NextResponse.json({ 'error': 'Not enough credits' })
    }
}

export async function GET(req: Request) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const uid = searchParams?.get('uid');
    const email = searchParams?.get('email');
    if (uid) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.uid, uid));
        return NextResponse.json(result[0]);
    }
    else if (email) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.createdBy, email))
            .orderBy(desc(WireframeToCodeTable.id))
            ;
        return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'No Record Found' })

}

export async function PUT(req: NextRequest) {
    const { uid, codeResp, prompt } = await req.json();

    const result = await db.update(WireframeToCodeTable)
        .set({
            code: codeResp,
            description: prompt,
        }).where(eq(WireframeToCodeTable.uid, uid))
        .returning({ uid: WireframeToCodeTable.uid })
    
    console.log("UpdateCodeToDb complete")

    return NextResponse.json(result);

}

export async function DELETE(req: NextRequest) {
    try {
        const { uid, email } = await req.json();

        if (!uid && !email) {
            return NextResponse.json({ error: "UID or email is required for deletion" }, { status: 400 });
        }

        if (uid) {
            // Delete a specific record by UID
            const result = await db.delete(WireframeToCodeTable)
                .where(eq(WireframeToCodeTable.uid, uid))
                .returning({ uid: WireframeToCodeTable.uid });

        if (result.length === 0) {
            return NextResponse.json({ error: "No record found to delete" }, { status: 404 });
        }

        return NextResponse.json({ message: "Record(s) deleted successfully", deleted: result });
    }

    } catch (error) {
        console.error("Error deleting record:", error);
        return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
    }
}