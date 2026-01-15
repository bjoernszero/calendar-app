import defaultDb from "./db";
import { Database } from "bun:sqlite";

export async function fetchHandler(req: Request, db: Database = defaultDb): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/api/bookings" && req.method === "GET") {
        const bookings = db.query("SELECT * FROM bookings ORDER BY date, time").all();
        return new Response(JSON.stringify(bookings), {
            headers: { "Content-Type": "application/json" }
        });
    }

    if (url.pathname === "/api/bookings" && req.method === "POST") {
        const body = await req.json() as { name: string, email: string, date: string, time: string, reason: string, image?: string };
        const { name, email, date, time, reason, image } = body;

        // Simple validation could go here

        try {
            const insert = db.prepare("INSERT INTO bookings (name, email, date, time, reason, image) VALUES (?, ?, ?, ?, ?, ?)");
            insert.run(name, email, date, time, reason, image || null);
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: "Database error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (url.pathname === "/api/bookings" && req.method === "DELETE") {
        const id = url.searchParams.get("id");
        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Missing id" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const query = db.prepare("DELETE FROM bookings WHERE id = ?");
            query.run(id);
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: "Database error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    if (url.pathname === "/api/bookings" && req.method === "PUT") {
        const body = await req.json() as { id: number, name: string, email: string, date: string, time: string, reason: string, image?: string };
        const { id, name, email, date, time, reason, image } = body;

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Missing id" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        try {
            const query = db.prepare("UPDATE bookings SET name = ?, email = ?, date = ?, time = ?, reason = ?, image = ? WHERE id = ?");
            query.run(name, email, date, time, reason, image || null, id);
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: "Database error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    // Serve static files
    let filePath = "dist" + url.pathname;
    if (url.pathname === "/") filePath = "dist/index.html";

    const file = Bun.file(filePath);
    if (await file.exists()) {
        return new Response(file);
    }

    // Fallback for SPA
    return new Response(Bun.file("dist/index.html"));
}

if (import.meta.main) {
    const server = Bun.serve({
        port: 8080,
        fetch: (req) => fetchHandler(req),
    });

    console.log(`Listening on http://localhost:${server.port} ...`);
}