import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function verifyTelegramInitData(initData) {
  if (!initData || !TELEGRAM_BOT_TOKEN) return null;

  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");

  if (!receivedHash) return null;

  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(TELEGRAM_BOT_TOKEN)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== receivedHash) return null;

  const authDate = Number(params.get("auth_date"));

  if (!authDate || Math.floor(Date.now() / 1000) - authDate > 86400) {
    return null;
  }

  try {
    return JSON.parse(params.get("user"));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { initData } = req.body || {};
    const telegramUser = verifyTelegramInitData(initData);

    if (!telegramUser) {
      return res.status(401).json({
        success: false,
        error: "Invalid Telegram authentication"
      });
    }

    const telegramId = telegramUser.id;

    const headers = {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json"
    };

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/users?telegram_id=eq.${telegramId}&select=*`,
      {
        method: "GET",
        headers
      }
    );

    if (!response.ok) {
      throw new Error("Supabase request failed");
    }

    const users = await response.json();

    if (users.length > 0) {
      return res.status(200).json({
        success: true,
        user: users[0]
      });
    }

    const newUser = {
      telegram_id: telegramId,
      username: telegramUser.username || null,
      first_name: telegramUser.first_name || null,
      balance: 0
    };

    const createResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/users`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=representation"
        },
        body: JSON.stringify(newUser)
      }
    );

    if (!createResponse.ok) {
      throw new Error("Failed to create user");
    }

    const createdUsers = await createResponse.json();

    return res.status(200).json({
      success: true,
      user: createdUsers[0]
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
}
