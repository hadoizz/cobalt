import { backdropLink, celebrationsEmoji, checkbox, footerButtons, multiPagePopup, popup, popupWithBottomButtons, settingsCategory, switcher } from "./elements.js";
import { services as s, appName, authorInfo, version, quality, repo, donations, supportedAudio } from "../config.js";
import { getCommitInfo } from "../sub/currentCommit.js";
import loc from "../../localization/manager.js";
import emoji from "../emoji.js";
import changelogManager from "../changelog/changelogManager.js";

let com = getCommitInfo();

let enabledServices = Object.keys(s).filter((p) => {
    if (s[p].enabled) return true;
}).sort().map((p) => {
    return s[p].alias ? s[p].alias : p
}).join(', ')

let donate = ``
let donateLinks = ``
let audioFormats = supportedAudio.map((p) => {
    return { "action": p }
})
audioFormats.unshift({ "action": "best" })
for (let i in donations["links"]) {
    donateLinks += `<a id="don-${i}" class="switch autowidth" href="${donations["links"][i]}" target="_blank">REPLACEME ${i}</a>`
}
let extr = ''
for (let i in donations["crypto"]) {
    donate += `<div class="subtitle${extr}">${i} (REPLACEME)</div><div id="don-${i}" class="text-to-copy" onClick="copy('don-${i}')">${donations["crypto"][i]}</div>`
    extr = ' top-margin'
}
export default function(obj) {
    audioFormats[0]["text"] = loc(obj.lang, 'SettingsAudioFormatBest');
    let ua = obj.useragent.toLowerCase();
    let isIOS = ua.match("iphone os");
    let isMobile = ua.match("android") || ua.match("iphone os");
    try {
        return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=${isIOS ? `1` : `5`}" />

        <title>${appName}</title>

        <meta property="og:url" content="${process.env.selfURL}" />
        <meta property="og:title" content="${appName}" />
        <meta property="og:description" content="${loc(obj.lang, 'EmbedBriefDescription')}" />
        <meta property="og:image" content="${process.env.selfURL}icons/generic.png" />
        <meta name="title" content="${appName}" />
        <meta name="description" content="${loc(obj.lang, 'AboutSummary')}" />
        <meta name="theme-color" content="#000000" />
        <meta name="twitter:card" content="summary" />

        <link rel="icon" type="image/x-icon" href="icons/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="icons/apple-touch-icon.png" />

        <link rel="manifest" href="manifest.webmanifest" />
        <link rel="stylesheet" href="cobalt.css" />
        <link rel="stylesheet" href="fonts/notosansmono.css" />

        <noscript><div style="margin: 2rem;">${loc(obj.lang, 'NoScriptMessage')}</div></noscript>
    </head>
    <body id="cobalt-body" data-nosnippet>
        ${multiPagePopup({
            name: "about",
            closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
            tabs: [{
                name: "about",
                title: `${emoji("🐲")} ${loc(obj.lang, 'AboutTab')}`,
                content: popup({
                    name: "about",
                    header: {
                        aboveTitle: {
                            text: loc(obj.lang, 'MadeWithLove'),
                            url: authorInfo.link
                        },
                        closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
                        title: loc(obj.lang, 'TitlePopupAbout')
                    },
                    body: [{
                        text: loc(obj.lang, 'AboutSummary')
                    }, {
                        text: `${loc(obj.lang, 'AboutSupportedServices')} ${enabledServices}.`
                    }, {
                        text: obj.lang !== "ru" ? loc(obj.lang, 'FollowTwitter') : ""
                    }, {
                        text: backdropLink(repo, loc(obj.lang, 'LinkGitHubIssues')),
                        classes: ["bottom-link"]
                    }]
                })
            }, {
                name: "changelog",
                title: `${emoji("🎉")} ${loc(obj.lang, 'ChangelogTab')}`,
                content: popup({
                    name: "changelog",
                    header: {
                        closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
                        title: `${emoji("🪄", 30)} ${loc(obj.lang, 'TitlePopupChangelog')}`
                    },
                    body: [{
                        text: `<div class="category-title">${loc(obj.lang, 'ChangelogLastMajor')}</div>`,
                        raw: true
                    }, {
                        text: changelogManager("banner") ? `<div class="changelog-banner"><img class="changelog-img" src="${changelogManager("banner")}" onerror="this.style.display='none'"></img></div>`: '',
                        raw: true
                    }, {
                        text: changelogManager("title"),
                        classes: ["changelog-subtitle"],
                        nopadding: true
                    }, {
                        text: changelogManager("content")
                    }, {
                        text: `<div class="separator"></div><span class="text-backdrop">${obj.hash}:</span> ${com[0]}`,
                        classes: ["changelog-subtitle"],
                        nopadding: true
                    }, {
                        text: com[1]
                    }, {
                        text: backdropLink(`${repo}/commits`, loc(obj.lang, 'LinkGitHubChanges')),
                        classes: ["bottom-link"]
                    }, {
                        text: `<div class="category-title">${loc(obj.lang, 'ChangelogOlder')}</div>`,
                        raw: true
                    }, {
                        text: `<div id="changelog-history"><button class="switch bottom-margin" onclick="loadOnDemand('changelog-history', '0')">${loc(obj.lang, "ChangelogPressToExpand")}</button></div>`,
                        raw: true
                    }]
                })
            }, {
                name: "donate",
                title: `${emoji("💰")} ${loc(obj.lang, 'DonationsTab')}`,
                content: popup({
                    name: "donate",
                    header: {
                        closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
                        title: emoji("💸", 30) + loc(obj.lang, 'TitlePopupDonate'),
                        subtitle: loc(obj.lang, 'DonateSub')
                    },
                    body: [{
                        text: `<div class="changelog-banner"><img class="changelog-img" src="updateBanners/catsleep.webp" onerror="this.style.display='none'"></img></div>`,
                        raw: true
                    },{
                        text: loc(obj.lang, 'DonateExplanation')
                    }, {
                        text: donateLinks.replace(/REPLACEME/g, loc(obj.lang, 'DonateVia')),
                        raw: true
                    }, {
                        text: loc(obj.lang, 'DonateLinksDescription'),
                        classes: ["explanation"]
                    }, {
                        text: `<div class="separator"></div>`,
                        raw: true
                    }, {
                        text: donate.replace(/REPLACEME/g, loc(obj.lang, 'ClickToCopy')),
                        classes: ["desc-padding"]
                    }, {
                        text: `<div class="separator"></div>`,
                        raw: true
                    }, {
                        text: loc(obj.lang, 'DonateHireMe', authorInfo.link),
                        classes: ["desc-padding"]
                    }]
                })
            }],
        })}
        ${multiPagePopup({
            name: "settings",
            closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
            header: {
                aboveTitle: {
                    text: `v.${version} ~ ${obj.hash}`,
                    url: `${repo}/commit/${obj.hash}`
                },
                title: `${emoji("⚙️", 30)} ${loc(obj.lang, 'TitlePopupSettings')}`
            },
            tabs: [{
                name: "video",
                title: `${emoji("🎬")} ${loc(obj.lang, 'SettingsVideoTab')}`,
                content: settingsCategory({
                    name: "downloads",
                    title: loc(obj.lang, 'SettingsDownloadsSubtitle'),
                    body: switcher({
                        name: "vQuality",
                        subtitle: loc(obj.lang, 'SettingsQualitySubtitle'),
                        explanation: loc(obj.lang, 'SettingsQualityDescription'),
                        items: [{
                            "action": "max",
                            "text": `${loc(obj.lang, 'SettingsQualitySwitchMax')}<br/>(2160p+)`
                        }, {
                            "action": "hig",
                            "text": `${loc(obj.lang, 'SettingsQualitySwitchHigh')}<br/>(${quality.hig}p)`
                        }, {
                            "action": "mid",
                            "text": `${loc(obj.lang, 'SettingsQualitySwitchMedium')}<br/>(${quality.mid}p)`
                        }, {
                            "action": "low",
                            "text": `${loc(obj.lang, 'SettingsQualitySwitchLow')}<br/>(${quality.low}p)`
                        }]
                    })
                }) + `${!isIOS ? checkbox("downloadPopup", loc(obj.lang, 'SettingsEnableDownloadPopup'), loc(obj.lang, 'AccessibilityEnableDownloadPopup'), 1) : ''}`
                    + settingsCategory({
                        name: "youtube",
                        body: switcher({
                            name: "vFormat",
                            subtitle: loc(obj.lang, 'SettingsFormatSubtitle'),
                            explanation: loc(obj.lang, 'SettingsFormatDescription'),
                            items: [{
                                "action": "mp4",
                                "text": "mp4 (av1)"
                            }, {
                                "action": "webm",
                                "text": "webm (vp9)"
                            }]
                        })
                    })
                    + settingsCategory({
                        name: "tiktok",
                        title: "tiktok & douyin",
                        body: checkbox("disableTikTokWatermark", loc(obj.lang, 'SettingsRemoveWatermark'))
                    })
            }, {
                name: "audio",
                title: `${emoji("🎶")} ${loc(obj.lang, 'SettingsAudioTab')}`,
                content: settingsCategory({
                    name: "general",
                    title: loc(obj.lang, 'SettingsAudioTab'),
                    body: switcher({
                        name: "aFormat",
                        subtitle: loc(obj.lang, 'SettingsFormatSubtitle'),
                        explanation: loc(obj.lang, 'SettingsAudioFormatDescription'),
                        items: audioFormats
                    })
                }) + settingsCategory({
                    name: "tiktok",
                    title: "tiktok & douyin",
                    body: checkbox("fullTikTokAudio", loc(obj.lang, 'SettingsAudioFullTikTok'), loc(obj.lang, 'SettingsAudioFullTikTok'), 3) + `<div class="explanation">${loc(obj.lang, 'SettingsAudioFullTikTokDescription')}</div>`
                })
            }, {
                name: "other",
                title: `${emoji("🪅")} ${loc(obj.lang, 'SettingsOtherTab')}`,
                content: settingsCategory({
                    name: "appearance",
                    title: loc(obj.lang, 'SettingsAppearanceSubtitle'),
                    body: switcher({
                        name: "theme",
                        subtitle: loc(obj.lang, 'SettingsThemeSubtitle'),
                        items: [{
                            "action": "auto",
                            "text": loc(obj.lang, 'SettingsThemeAuto')
                        }, {
                            "action": "dark",
                            "text": loc(obj.lang, 'SettingsThemeDark')
                        }, {
                            "action": "light",
                            "text": loc(obj.lang, 'SettingsThemeLight')
                        }]
                    }) + checkbox("alwaysVisibleButton", loc(obj.lang, 'SettingsKeepDownloadButton'), loc(obj.lang, 'AccessibilityKeepDownloadButton'), 2)
                }) + settingsCategory({
                    name: "miscellaneous",
                    title: loc(obj.lang, 'Miscellaneous'),
                    body: checkbox("disableChangelog", loc(obj.lang, 'SettingsDisableNotifications'))
                })
            }],
        })}
        ${popup({
            name: "download",
            standalone: true,
            header: {
                closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
                subtitle: loc(obj.lang, 'TitlePopupDownload')
            },
            body: switcher({
                name: "download",
                subtitle: loc(obj.lang, 'DownloadPopupWayToSave'),
                explanation: `${!isIOS ? loc(obj.lang, 'DownloadPopupDescription') : loc(obj.lang, 'DownloadPopupDescriptionIOS')}`,
                items: `<a id="pd-download" class="switch full space-right" target="_blank" href="/">${loc(obj.lang, 'Download')}</a>
                <div id="pd-copy" class="switch full">${loc(obj.lang, 'CopyURL')}</div>`
            })
        })}
        ${popupWithBottomButtons({
            name: "picker",
            closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
            header: {
                title: `<div id="picker-title"></div>`,
                explanation: `<div id="picker-subtitle"></div>`,
            },
            buttons: [`<a id="picker-download" class="switch" target="_blank" href="/">${loc(obj.lang, 'ImagePickerDownloadAudio')}</a>`],
            content: '<div id="picker-holder"></div>'
        })}
        ${popup({
            name: "error",
            standalone: true,
            buttonOnly: true,
            emoji: emoji("☹️", 48, 1),
            classes: ["small"],
            buttonText: loc(obj.lang, 'ErrorPopupCloseButton'),
            header: {
                closeAria: loc(obj.lang, 'AccessibilityClosePopup'),
                title: loc(obj.lang, 'TitlePopupError')
            },
            body: `<div id="desc-error" class="desc-padding subtext"></div>`
        })}
        <div id="popup-backdrop" style="visibility: hidden;" onclick="hideAllPopups()"></div>
        <div id="cobalt-main-box" class="center" style="visibility: hidden;">
            <div id="logo-area">${appName}</div>
            <div id="download-area" class="mobile-center">
                <div id="top">
                    <input id="url-input-area" class="mono" type="text" autocorrect="off" maxlength="128" autocapitalize="off" placeholder="${loc(obj.lang, 'LinkInput')}" aria-label="${loc(obj.lang, 'AccessibilityInputArea')}" oninput="button()"></input>
                    <button id="url-clear" onclick="clearInput()" style="display:none;">x</button>
                    <input id="download-button" class="mono dontRead" onclick="download(document.getElementById('url-input-area').value)" type="submit" value="" disabled=true aria-label="${loc(obj.lang, 'AccessibilityDownloadButton')}">
                </div>
                <div id="bottom">
                    <button id="pasteFromClipboard" class="switch" onclick="pasteClipboard()" aria-label="${loc(obj.lang, 'PasteFromClipboard')}">${emoji("📋", 22)} ${loc(obj.lang, 'PasteFromClipboard')}</button>
                    <button id="audioMode" class="switch" onclick="toggle('audioMode')" aria-label="${loc(obj.lang, 'AccessibilityModeToggle')}">${emoji("✨", 22, 1)}</button>
                </div>
            </div>
        </div>
        <footer id="footer" style="visibility: hidden;">
        ${/* big action buttons are ALWAYS either first or last, because usual buttons are bundled in pairs and are sandwiched between bigger buttons for mobile view */
        footerButtons([{
            name: "about",
            type: "popup",
            text: `${emoji(celebrationsEmoji() , 22)} ${loc(obj.lang, 'AboutTab')}`,
            aria: loc(obj.lang, 'AccessibilityOpenAbout')
        }, {
            name: "about",
            type: "popup",
            context: "donate",
            text: `${emoji("💰", 22)} ${loc(obj.lang, 'Donate')}`,
            aria: loc(obj.lang, 'AccessibilityOpenDonate')
        }, {
            name: "settings",
            type: "popup",
            text: `${emoji("⚙️", 22)} ${loc(obj.lang, 'TitlePopupSettings')}`,
            aria: loc(obj.lang, 'AccessibilityOpenSettings')
        }]
        )}
        </footer>
    </body>
    <script type="text/javascript">const loc = {
        noInternet: ` + "`" + loc(obj.lang, 'ErrorNoInternet') + "`" + `,
        noURLReturned: ` + "`" + loc(obj.lang, 'ErrorNoUrlReturned') + "`" + `,
        unknownStatus: ` + "`" + loc(obj.lang, 'ErrorUnknownStatus') + "`" + `,
        collapseHistory: ` + "`" + loc(obj.lang, 'ChangelogPressToHide') + "`" + `,
        toggleDefault: '${emoji("✨")} ${loc(obj.lang, "ModeToggleAuto")}',
        toggleAudio: '${emoji("🎶")} ${loc(obj.lang, "ModeToggleAudio")}',
        pickerDefault: ` + "`" + loc(obj.lang, 'MediaPickerTitle') + "`" + `,
        pickerImages: ` + "`" + loc(obj.lang, 'ImagePickerTitle') + "`" + `,
        pickerImagesExpl: ` + "`" + loc(obj.lang, `ImagePickerExplanation${isMobile ? "Phone" : "PC"}`) + "`" + `,
        pickerDefaultExpl: ` + "`" + loc(obj.lang, `MediaPickerExplanation${isMobile ? `Phone${isIOS ? "IOS" : ""}` : "PC"}`) + "`" + `,
    };</script>
    <script type="text/javascript" src="cobalt.js"></script>
</html>`;
    } catch (err) {
        return `${loc(obj.lang, 'ErrorPageRenderFail', obj.hash)}`;
    }
}
