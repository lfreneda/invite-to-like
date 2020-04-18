var inviteTotal = 200
var inviteDialog = null
var seeMoreButtonClicks = 0
var sameElegibleLinkCounts = 0

var randomIntFromInterval = function (min = 3, max = 10) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

var getElegibleInviteLinks = function () {
  var inviteLinks = []
  var links = inviteDialog.querySelectorAll('a')
  for (var link of links) {
    var isInviteButton = link.textContent.indexOf('Invite') !== -1
    if (isInviteButton) {
      inviteLinks.push(link)
    }
  }
  return inviteLinks
}

var tryScroll = function (scrollTop) {
  try {
    var scrollables = inviteDialog.querySelectorAll('.uiScrollableAreaWrap')
    for (var scrollable of scrollables) {
      scrollable.scrollTop += scrollTop
    }
  } catch (err) {
    console.log('tryScrollDown:', err)
  }
}

var tryFocusElement = function (element) {
  try {
    element.scrollIntoView()
  } catch (err) {
    console.log('tryFocusElement:', err)
  }
}

var clickSeeMore = function () {
  var links = inviteDialog.querySelectorAll('a')
  for (var link of links) {
    var isSeeMoreButton = link.textContent.indexOf('See More') !== -1
    if (isSeeMoreButton) {
      tryFocusElement(link)
      tryScroll(100)
      link.click()
      setTimeout(() => { tryScroll(999999999) }, 2 * 1000)
      seeMoreButtonClicks++
    }
  }
}

var clickAndWaitOn = function ({ links, currentIndex }, done) {
  if (currentIndex >= links.length) {
    return done(currentIndex++)
  }

  const currentLink = links[currentIndex]
  tryFocusElement(currentLink)
  tryScroll(-100)

  currentLink.click()

  var randomSeconds = randomIntFromInterval()
  console.log(`Invite ${(currentIndex + 1)} sent, waiting ${randomSeconds} seconds to invite next user`)
  setTimeout(() => {
    clickAndWaitOn({ links, currentIndex: ++currentIndex }, done)
  }, (randomSeconds * 1000))
}

var loadInviteLinks = function (done) {
  var linksBeforeClick = getElegibleInviteLinks()
  clickSeeMore()
  var links = getElegibleInviteLinks()
  console.log(`Found ${links.length} elegible invite links on dialog`)

  var sameLinksCountBeforeAndAfterLoad = linksBeforeClick.length === links.length
  if (sameLinksCountBeforeAndAfterLoad) {
    sameElegibleLinkCounts++
  } else {
    sameElegibleLinkCounts = 0
  }

  if (links.length >= inviteTotal) {
    console.log(`Total invite links loaded ${links.length}`)
    return done(links)
  }
  if (sameElegibleLinkCounts > 15) {
    console.log('"See More" button clicks and could not load more elegible invite links for a while..')
    return done(links)
  }

  var randomSeconds = randomIntFromInterval()
  console.log(`Clicked on "See More" (${seeMoreButtonClicks}) button and waiting for ${randomSeconds} seconds..`)
  setTimeout(() => {
    loadInviteLinks(done)
  }, (randomSeconds * 1000))
}

var invitePeopleOf = function (dialog) {
  inviteDialog = dialog
  loadInviteLinks((links) => {
    clickAndWaitOn({ links, currentIndex: 0 }, (totalInvited) => {
      alert('Script completed: ' + totalInvited + ' people invited')
    })
  })
}

var printHeader = function () {
  console.log('')
  console.log('------------------------------------------------------')
  console.log('   █ █▄░█ █░█ █ ▀█▀ █▀▀ ▄▄ ▀█▀ █▀█ ▄▄ █░░ █ █▄▀ █▀▀')
  console.log('   █ █░▀█ ▀▄▀ █ ░█░ ██▄ ░░ ░█░ █▄█ ░░ █▄▄ █ █░█ ██▄')
  console.log('------------------------------------------------------')
  console.log('  Invite people who interacted with a Facebook post')
  console.log(' More info: https://github.com/lfreneda/invite-to-like')
  console.log('------------------------------------------------------')
  console.log('')
}

var run = function () {
  printHeader()
  setTimeout(() => {
    var dialogs = document.querySelectorAll('[role="dialog"]')
    for (var dialog of dialogs) {
      var isInviteDialog = dialog.textContent.indexOf('Invite to Like') !== -1
      if (isInviteDialog) {
        return invitePeopleOf(dialog)
      }
    }
    var errMessage = 'Error: Could not found "invite to like" dialog @w@'
    console.log(errMessage)
    alert(errMessage)
  }, 3000)
}

run()
