import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { fetchHandler } from "./index";
import { createDb } from "./db";
import { Database } from "bun:sqlite";

describe("API Endpoints", () => {
    let db: Database;

    beforeEach(() => {
        db = createDb(":memory:");
    });

    afterEach(() => {
        db.close();
    });

    test("GET /api/bookings should return empty list initially", async () => {
        const req = new Request("http://localhost/api/bookings");
        const res = await fetchHandler(req, db);
        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toEqual([]);
    });

    test("POST /api/bookings should create a new booking", async () => {
        const payload = {
            name: "Jane Doe",
            email: "jane@example.com",
            date: "2023-11-01",
            time: "14:00",
            reason: "Checkup"
        };
        const req = new Request("http://localhost/api/bookings", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });
        const res = await fetchHandler(req, db);
        expect(res.status).toBe(200);
        const data = await res.json() as any;
        expect(data.success).toBe(true);

        // Verify it exists in DB
        const booking = db.query("SELECT * FROM bookings WHERE email = ?").get("jane@example.com") as any;
        expect(booking).toBeDefined();
        expect(booking.name).toBe("Jane Doe");
    });

    test("DELETE /api/bookings should remove a booking", async () => {
        // Setup existing booking
        db.run("INSERT INTO bookings (name, email, date, time, reason) VALUES (?, ?, ?, ?, ?)", ["To Delete", "delete@me.com", "2023-12-01", "10:00", "Delete"]);
        const booking = db.query("SELECT id FROM bookings WHERE email = 'delete@me.com'").get() as any;
        const id = booking.id;

        const req = new Request(`http://localhost/api/bookings?id=${id}`, {
            method: "DELETE"
        });
        const res = await fetchHandler(req, db);
        expect(res.status).toBe(200);

        const check = db.query("SELECT * FROM bookings WHERE id = ?").get(id);
        expect(check).toBeNull();
    });

    test("PUT /api/bookings should update a booking", async () => {
        db.run("INSERT INTO bookings (name, email, date, time, reason) VALUES (?, ?, ?, ?, ?)", ["Old Name", "old@me.com", "2023-12-01", "10:00", "Update"]);
        const booking = db.query("SELECT id FROM bookings WHERE email = 'old@me.com'").get() as any;
        const id = booking.id;

        const payload = {
            id,
            name: "New Name",
            email: "new@me.com",
            date: "2023-12-02",
            time: "11:00",
            reason: "Updated"
        };

        const req = new Request("http://localhost/api/bookings", {
            method: "PUT",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        const res = await fetchHandler(req, db);
        expect(res.status).toBe(200);

        const updated = db.query("SELECT * FROM bookings WHERE id = ?").get(id) as any;
        expect(updated.name).toBe("New Name");
        expect(updated.email).toBe("new@me.com");
    });
});
