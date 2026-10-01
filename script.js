(function () {

  const tg = window.Telegram && window.Telegram.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  let balance = 0;
  const MIN_WITHDRAW = 100;

  const balanceElement = document.getElementById("balance");
  const messageElement = document.getElementById("message");
  const withdrawButton = document.getElementById("withdrawBtn");
  const taskButtons = document.querySelectorAll(".task-btn");

  function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
  }

  function showMessage(message) {
    messageElement.textContent = message;

    setTimeout(function () {
      if (messageElement.textContent === message) {
        messageElement.textContent = "";
      }
    }, 3500);
  }

  taskButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const reward = Number(button.dataset.reward);

      if (!Number.isFinite(reward) || reward <= 0) {
        return;
      }

      button.disabled = true;

      balance += reward;

      updateBalance();

      showMessage("Reward added: +" + reward + " N");

      setTimeout(function () {
        button.disabled = false;
      }, 3000);

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
      "Withdrawal request system will be connected next."
    );

  });

  updateBalance();

})();