(function () {

  const tg = window.Telegram && window.Telegram.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  const SMARTLINK = "https://omg10.com/4/11526446";
  const MIN_WITHDRAW = 100;

  let balance = Number(localStorage.getItem("earnNovaBalance")) || 0;
  let lastCheckIn = localStorage.getItem("earnNovaCheckIn") || "";

  const balanceElement = document.getElementById("balance");
  const messageElement = document.getElementById("message");
  const withdrawButton = document.getElementById("withdrawBtn");
  const taskButtons = document.querySelectorAll(".task-btn");

  function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
    localStorage.setItem("earnNovaBalance", balance.toString());
  }

  function showMessage(message) {
    messageElement.textContent = message;

    setTimeout(function () {
      if (messageElement.textContent === message) {
        messageElement.textContent = "";
      }
    }, 3500);
  }

  function getToday() {
    const now = new Date();

    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0")
    );
  }

  taskButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const reward = Number(button.dataset.reward);
      const taskName =
        button.closest(".task")?.querySelector("strong")?.textContent || "";

      if (!Number.isFinite(reward) || reward <= 0) {
        return;
      }

      /*
       * Watch Advertisement
       * SmartLink opens, but no automatic reward is added.
       */
      if (taskName === "Watch an Advertisement") {

        window.open(SMARTLINK, "_blank");

        showMessage(
          "Advertisement opened. Reward will be added only after verification."
        );

        return;
      }

      /*
       * Daily Check-in
       */
      if (taskName === "Daily Check-in") {

        const today = getToday();

        if (lastCheckIn === today) {
          showMessage("You have already claimed today's reward.");
          return;
        }

        lastCheckIn = today;
        localStorage.setItem("earnNovaCheckIn", today);

        balance += reward;
        updateBalance();

        showMessage("Daily reward added: +" + reward + " N");

        return;
      }

    });

  });

  withdrawButton.addEventListener("click", function () {

    if (balance < MIN_WITHDRAW) {

      showMessage(
        "You need at least " +
        MIN_WITHDRAW +
        " N to request a withdrawal."
      );

      return;
    }

    showMessage(
      "Withdrawal system will be connected after backend setup."
    );

  });

  updateBalance();

})();
