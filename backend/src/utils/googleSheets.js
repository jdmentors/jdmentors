import { google } from "googleapis";

const SHEET_TAB = "Bookings";

function getSheetsClient() {
    const keyJson = JSON.parse(
        Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_B64, "base64").toString("utf8")
    );
    const auth = new google.auth.GoogleAuth({
        credentials: keyJson,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
}

export async function recordBooking({ type, name, email, item, price, details }) {
    try {
        const sheets = getSheetsClient();
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

        const meta = await sheets.spreadsheets.get({ spreadsheetId });
        const tab = meta.data.sheets.find(s => s.properties.title === SHEET_TAB);
        if (!tab) throw new Error(`Sheet tab "${SHEET_TAB}" not found`);
        const sheetId = tab.properties.sheetId;

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [{
                    insertDimension: {
                        range: { sheetId, dimension: "ROWS", startIndex: 1, endIndex: 2 },
                        inheritFromBefore: false,
                    },
                }],
            },
        });

        const now = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${SHEET_TAB}!A2:G2`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[now, type || "", name || "", email || "", item || "", price || "", details || ""]],
            },
        });

        console.log("Booking recorded to sheet:", email, item);
    } catch (error) {
        console.error("Google Sheets recording failed (booking unaffected):", error.message);
    }
}
