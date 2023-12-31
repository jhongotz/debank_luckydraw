// ==UserScript==
// @name         debank_luckydraw
// @namespace    http://tampermonkey.net/
// @version      0.5.7
// @description  DeBank automatic raffles!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=debank.com
// ==/UserScript==

function startScript() {
    'use strict';

    let success = 0
    let errors = 0

    // Function to execute the main script
    let switchForCustomPrice = true

    let state = false
    let switchForRandT = true

    function runMainScript() {
        if(state) {

            let joinTheDraw = "Button_button__1yaWD Button_is_primary__1b4PX RichTextView_joinBtn__3dHYH" // Массив
            let follow = "Button_button__1yaWD Button_is_primary__1b4PX FollowButton_followBtn__DtOgj JoinDrawModal_joinStepBtn__DAjP0"
            let repost = "Button_button__1yaWD Button_is_primary__1b4PX JoinDrawModal_joinStepBtn__DAjP0"
            let following = "FollowButton_follwing__2itpB"
            let reposted = "Button_button__1yaWD Button_is_gray__3nV7y Button_is_disabled__18BCT JoinDrawModal_joinStepBtn__DAjP0 JoinDrawModal_isSuccess__1EVms" // Два в массиве если подписан
            let successTitle = "JoinDrawModal_drawSuccessTitle__2bnFS" // Проверка 
            let drawToken = "JoinDrawModal_tokenDesc__1PIxe" // Номер токена
            let joinTheLuckyDraw = "Button_button__1yaWD Button_is_primary__1b4PX JoinDrawModal_submitBtn__RJXvp" // Join The Lucky Draw
            let closeButton = "CommonModal_closeModalButton__1swng" // Кнопка закрытия
            let qualified = "JoinDrawModal_inValidTag__3Sfee"
            let prizeTitle = "RichTextView_prizeTitle__5wXAk"

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            let delayBetweenTasks = 3000

            async function startTask(element, index) {
                let postTYPE
                try {
                    postTYPE = element.getElementsByClassName(prizeTitle)[0].innerHTML // Работа
                } catch (error) {

                }

                let buttonElement = element.querySelector('button');
                let trustButton = element.getElementsByClassName("ArticleContent_opIconWrap__3YjdX")[3]
                let repostButton = element.getElementsByClassName("ArticleContent_opIconWrap__3YjdX")[1]

                let skip = false
                if (!buttonElement) {
                    skip = true
                } else {
                    if (!switchForCustomPrice) {
                        skip = false
                    } else {
                        if (postTYPE == 'Custom Prize' && switchForCustomPrice) {
                            skip = true
                        } else if (postTYPE === undefined || null) {
                            skip = true
                        }
                    }
                }
                if (!skip && state) {
                    await delay(200)
                    if(switchForRandT) {
                        if (!repostButton.innerHTML.includes("var(--color-primary)")) { repostButton.click() }
                        if (!trustButton.innerHTML.includes("green")) { trustButton.click() }
                    }
                    buttonElement.click()
                    await delay(2000)
                    let qualifiedORnot = document.getElementsByClassName(qualified).length
                    if (qualifiedORnot > 0) {
                        console.log(`Task - ${index} does not meet the conditions, exit!`)
                        ++errors
                        document.getElementsByClassName(closeButton)[0].click()
                        delayBetweenTasks = 0
                    } else {
                        try {
                            let followON = document.getElementsByClassName(follow)
                            for (let buttons of followON) {
                                buttons.click()
                            }
                        } catch (err) {
                            console.log("Seems already pressed")
                            console.log(err)
                        }
                        try {
                            let repostON = document.getElementsByClassName(repost)
                            for (let buttons of repostON) {
                                buttons.click()
                            }
                        } catch (err) {
                            console.log("Seems already pressed")
                            console.log(err)
                        }

                        let interval = setInterval(() => {
                            let join = document.getElementsByClassName(joinTheLuckyDraw)
                            if (join.length == 1) {
                                join[0].click()
                            }
                            let congrats = document.getElementsByClassName(successTitle)
                            if (congrats.length == 1) {
                                try {
                                    let close = document.getElementsByClassName(closeButton)
                                    close[0].click()
                                    clearInterval(interval)
                                    ++success
                                } catch (err) {
                                    console.log(err)
                                    ++errors
                                }
                            }
                        }, 1000);
                    }
                    } else {
                        delayBetweenTasks = 0
                        console.log(`Skipped because of custom prize or because already registered - task: ${index}`)
                    }

            }


            function simulateScroll(callback) {
                // Specify the coordinates where you want to scroll to (in this example, scrolling to the Y-coordinate 1000)
                const scrollToY = callback;
                // Scroll the page to the specified coordinates
                window.scrollBy({
                    top: scrollToY,
                    behavior: 'smooth' // Use 'auto' for instant scrolling, or 'smooth' for smooth scrolling
                });
            }

            async function main() {
                button.textContent = "Running DeBank Enjoyer 💰";
                button.style.backgroundColor = "#ef7c39";
                button.style.padding = "5px 2px";
                button.style.top = "120px";
                button.style.left = "10px";
                let feedListItem = document.getElementsByClassName("ArticleContent_articleMain__2EFKB FeedListItem_content__2XFtk")

                if (feedListItem.length != 0) {
                    console.log(`Loaded ${feedListItem.length} raffle/s`)

                    let index = 0

                    for (let element of feedListItem) {
                        delayBetweenTasks = 1000
                        await startTask(element, index)
                        await delay(delayBetweenTasks)
                        console.log(`Task done ${index}!`)
                        ++index
                    }
                } else {
                    console.log("Scrolling to find more raffles")
                    await delay(parseInt(Math.random()*1000 + 500))
                }
                simulateScroll(500)
                await delay(800)
                if (state) {
                    main()
                }
            }
            if (state) {
                 main()
            }
        }
    }

    // Create the button element
    const button = document.createElement("button");
    function runButtonDefault(){
        button.classList.add("btnbtn");
        button.textContent = "Run DeBank Enjoyer 🫡";
        button.style.position = "fixed";
        button.style.top = "280px";
        button.style.left = "12px";
        button.style.backgroundColor = "#4CAF50";
        button.style.color = "white";
        button.style.padding = "5px 15px";
        button.style.fontSize = "16px";
        button.style.border = "none";
        button.style.borderRadius = "10px";
        button.style.zIndex = "9999"; // Set the z-index to make sure the button appears on top
    }
    runButtonDefault()

    // Append the button to the page
    document.body.appendChild(button);

    // Set the button's click event to run the main script
    button.addEventListener("click", function(){
        switch (state) {
            case false:
                state = true
                runMainScript()
                break;
            case true:
                state = false
                runButtonDefault()
                break;
            default:
                break;
        }
    });

    const statisticsElement = document.createElement("div");
    const elmwithstatistic = document.createElement("div");
    statisticsElement.appendChild(elmwithstatistic);

    function updateStatisticsText() {
        elmwithstatistic.textContent = `Stats:\nJoin in: ${success} raffles\nErrors: ${errors}\n`;
    }

    // Create the hyperlink element
    const debank = document.createElement("a");
    debank.href = "https://debank.com/profile/0x328a2a04d32bccfdbbe0d307ff876b8d43b0e807/";
    debank.textContent = "DeBank 💎 | ";

    statisticsElement.appendChild(document.createElement("br"));
    statisticsElement.appendChild(debank);

    const github = document.createElement("a");
    github.href = "https://github.com/jhongotz";
    github.textContent = "Github 💎";

    // statisticsElement.appendChild(document.createElement("br"));
    statisticsElement.appendChild(github);

    const telegram = document.createElement("a");
    telegram.href = "https://t.me/nftmms";
    telegram.textContent = "Telegram 💎\n";

    statisticsElement.appendChild(document.createElement("br"));
    statisticsElement.appendChild(telegram);

    const switchButton = document.createElement("button");

    statisticsElement.appendChild(document.createElement("br"));
    statisticsElement.appendChild(switchButton);
    switchButton.textContent = `Skip Custom Price ON 💰`
    switchButton.style.backgroundColor = "#00c087";
    switchButton.style.borderRadius = "10px";
    switchButton.style.color = "white";
    switchButton.style.fontSize = "13px";
    switchButton.style.width = "179px"
    switchButton.style.height = "32px"
    switchButton.addEventListener("click", function() {
            switch (switchForCustomPrice) {
                case true:
                    switchForCustomPrice = true
                    switchButton.textContent = `Skip Custom Price OFF 💩`
                    switchButton.style.backgroundColor = "#fe815f";
                    break;
                case false:
                    switchForCustomPrice = false
                    switchButton.textContent = `Skip Custom Price ON 💰`
                    switchButton.style.backgroundColor = "#00c087";
                    break;
                default:
                    break;
            }
    })

        async function followORunfollow(mode) {

            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            let htmlCode = document.getElementsByClassName("FollowButton_followBtnIcon__cZE9v")
            if (htmlCode.length != 0) {
                for (let element of htmlCode) {
                    await otpiskaNahuyORpodpiska(element, mode)
                }
            } else {
                alert("Make sure you are on following or followers page")
            }

            async function otpiskaNahuyORpodpiska(element, mode) {
                try {
                    let svgElement = element.querySelector('g');
                    let followORnot = svgElement.getAttribute("clip-path")

                    if (mode == "Unfollow") {
                        if (followORnot == "url(#clip0_11356_89186)") {
                            console.log("Already Unfollowed")
                        } else {
                            console.log("Unfollowed")
                            await delay(200)
                            element.click()
                        }
                    }
                    if (mode == "Follow") {
                        if (followORnot == "url(#clip0_11356_89186)") {
                            console.log("Followed")
                            await delay(200)
                            element.click()
                        } else {
                            console.log("Already Followed")
                        }
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }

        const friendsRemover = document.createElement("button");
        statisticsElement.appendChild(document.createElement("br"));
        statisticsElement.appendChild(friendsRemover);
        friendsRemover.textContent = `Bulk Unfollow`
        friendsRemover.style.backgroundColor = "#fe815f";
        friendsRemover.style.borderRadius = "10px";
        friendsRemover.style.color = "white";
        friendsRemover.style.fontSize = "12px";
        friendsRemover.style.width = "90px"
        friendsRemover.style.height = "32px"
        friendsRemover.addEventListener("click", function() {
            followORunfollow("Unfollow");
        })
        const friendsAdd = document.createElement("button");
        // statisticsElement.appendChild(document.createElement("br"));
        statisticsElement.appendChild(friendsAdd);
        friendsAdd.textContent = `Bulk Follow`
        friendsAdd.style.backgroundColor = "#fe815f";
        friendsAdd.style.borderRadius = "10px";
        friendsAdd.style.color = "white";
        friendsAdd.style.fontSize = "12px";
        friendsAdd.style.width = "90px"
        friendsAdd.style.height = "32px"
        friendsAdd.addEventListener("click", function() {
            followORunfollow("Follow");
        })

        const repostANDtrust = document.createElement("button");
        statisticsElement.appendChild(document.createElement("br"));
        statisticsElement.appendChild(repostANDtrust);
        repostANDtrust.textContent = `R&T ON`
        repostANDtrust.style.backgroundColor = "#00c087";
        repostANDtrust.style.borderRadius = "10px";
        repostANDtrust.style.color = "white";
        repostANDtrust.style.fontSize = "13px";
        repostANDtrust.style.width = "90px"
        repostANDtrust.style.height = "32px"
        repostANDtrust.addEventListener("click", function() {
            switch (switchForRandT) {
                case true:
                    switchForRandT = true
                    repostANDtrust.textContent = `R&T OFF`
                    repostANDtrust.style.backgroundColor = "#f63d3d";
                    break;
                case false:
                    repostANDtrust.textContent = `R&T ON`
                    repostANDtrust.style.backgroundColor = "#00c087";
                    switchForRandT = false
                    break;
                default:
                    break;
            }
        })


    setInterval(() => {
        updateStatisticsText()
    }, 500);

    statisticsElement.style.whiteSpace = "pre-wrap";
    statisticsElement.style.position = "fixed";
    statisticsElement.style.bottom = "250px";
    statisticsElement.style.left = "10px";
    statisticsElement.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    statisticsElement.style.borderRadius = "10px";
    statisticsElement.style.color = "white";
    statisticsElement.style.padding = "10px";
    statisticsElement.style.fontSize = "16px";
    statisticsElement.style.zIndex = "9999"; // Set the z-index to make sure the text appears on top

    // Append the statistics element to the page
    document.body.appendChild(statisticsElement);
    document.getElementsByClassName('btnbtn')[0].click();


    setTimeout(function(){
	location.reload();
}, 30000);
}

window.onload = startScript
