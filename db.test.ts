import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { createDb } from "./db";
import { Database } from "bun:sqlite";

describe("Database Layer", () => {
    let db: Database;

    beforeEach(() => {
        // Use in-memory database for fresh state each test
        db = createDb(":memory:");
    });

    afterEach(() => {
        db.close();
    });

    test("should initialize database schema related to bookings", () => {
        const tableInfo = db.query("PRAGMA table_info(bookings)").all();
        expect(tableInfo).not.toBeEmpty();

        const columnNames = tableInfo.map((col: any) => col.name);
        expect(columnNames).toContain("id");
        expect(columnNames).toContain("name");
        expect(columnNames).toContain("email");
        expect(columnNames).toContain("reason");
        expect(columnNames).toContain("image");
    });

    test("should insert and retrieve a booking", () => {
        const insert = db.prepare("INSERT INTO bookings (name, email, date, time, reason, image) VALUES (?, ?, ?, ?, ?, ?)");
        insert.run("John Doe", "john@example.com", "2023-10-27", "10:00", "Consultation", "base64image");

        const booking = db.query("SELECT * FROM bookings WHERE email = ?").get("john@example.com") as any;
        expect(booking).toBeDefined();
        expect(booking.name).toBe("John Doe");
        expect(booking.image).toBe("base64image");
    });
});
