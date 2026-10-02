// EarnNova Rewards Bot

// Telegram Mini App
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();
}


// Balance
let balance = parseFloat(
    localStorage.getItem("earnNovaBalance") || "0"
);

const balanceElement = document.getElementById("balance");

function updateBalance() {
    if (balanceElement) {
        balanceElement.textContent = balance.toFixed(2);
    }

    localStorage.setItem(
        "earnNovaBalance",
        balance.toString()
    );
}

updateBalance();


// Watch Advertisement
const watchAdBtn = document.getElementById("watchAdBtn");

if (watchAdBtn) {

    watchAdBtn.addEventListener("click", function () {

        if (typeof show_11943155 === "function") {

            // Open Monetag advertisement
            show_11943155();

        } else {

            console.log(
                "Monetag SDK is not loaded yet."
            );

            alert(
                "Advertisement is loading. Please try again in a few seconds."
            );
        }

    });

}


// Daily Check-in
const rewardButtons = document.querySelectorAll(
    ".task-btn[data-reward]"
);

rewardButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const reward = parseFloat(
            button.dataset.reward
        );

        if (!isNaN(reward)) {

            balance += reward;

            updateBalance();

            button.textContent = "Claimed";

            button.disabled = true;

            const message =
                document.getElementById("message");

            if (message) {
                message.textContent =
                    `You earned +${reward} N`;
            }
        }

    });

});


// Withdraw
const withdrawBtn =
    document.getElementById("withdrawBtn");

if (withdrawBtn) {

    withdrawBtn.addEventListener("click", function() {

        if (balance < 100) {

            alert(
                "Minimum withdrawal is 100 N."
            );

            return;
        }

        alert(
            "Withdrawal request feature is not connected yet."
        );

    });

}
