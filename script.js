const tg = window.Telegram?.WebApp;

const SMARTLINK = "https://omg10.com/4/11526446";
const MIN_WITHDRAW = 100;

let balance = 0;
let telegramUser = null;

// Telegram Mini App initialize
if (tg) {
  tg.ready();
  tg.expand();
}

// Elements
const balanceElement = document.querySelector("#balance");
const resultElement = document.querySelector("#result");

// Show balance
function updateBalance() {
  if (balanceElement) {
    balanceElement.textContent = `${Number(balance).toFixed(2)} N`;
  }
}

// Load user from backend
async function loadUser() {
  try {
    if (!tg || !tg.initData) {
      console.log("Telegram Mini App data not available.");
      return;
    }

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        initData: tg.initData
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("User API error:", data);
      return;
    }

    telegramUser = data.user;
    balance = Number(data.user.balance || 0);

    updateBalance();

    console.log("EarnNova user loaded:", telegramUser);
  } catch (error) {
    console.error("Failed to load user:", error);
  }
}

// Watch Advertisement
function watchAd() {
  window.open(SMARTLINK, "_blank");

  if (resultElement) {
    resultElement.textContent =
      "Advertisement opened. Rewards are added only after verified task completion.";
  }
}

// Daily Check-in
function dailyCheckin() {
  if (resultElement) {
    resultElement.textContent =
      "Daily Check-in backend will be connected next.";
  }
}

// Withdraw
function withdraw() {
  if (balance < MIN_WITHDRAW) {
    if (resultElement) {
      resultElement.textContent =
        `Minimum withdrawal is ${MIN_WITHDRAW} N.`;
    }
    return;
  }

  if (resultElement) {
    resultElement.textContent =
      "Withdrawal system will be connected next.";
  }
}

// Make functions available to HTML onclick buttons
window.watchAd = watchAd;
window.dailyCheckin = dailyCheckin;
window.withdraw = withdraw;

// Start
loadUser();
