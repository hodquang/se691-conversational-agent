# se691-conversational-agent

# Setup (if you want to rebuild it)
- Make sure Node version is up-to-date (npm install)
- Install: react-native
- Install: react-native-dialogflow, react-native-voice, react-native-gifted-chat

# How to view
- get into the root folder for Chatbot
- Open App.js to view the code
- env.js contains the dialogflowConfig JSON

# How to edit (VS Code)
- Open Terminal
- cd ~/Chatbot (just make sure you are in the root directory)
- code . (to open VS Code for edit)

# How to run
- react-native run-ios (or npx react-native run-ios)
- react-native run-android
- If the simulator doesn't show up, you can open the simulator manually with:
  + Xcode Simulator
  + Android Studio (https://developer.android.com/studio/?gclid=CjwKCAjw_L6LBhBbEiwA4c46ukIoqLbJjZGt7VPSEXEXGdLBYnZbhEaUxM7AuPrho1QaXDcV82lonRoCGKEQAvD_BwE&gclsrc=aw.ds)


# Setup From Scratch on Mac M1 on Rosetta (should be similar to non-M1.  I used the regular terminal, as I was having trouble using VSCode's built-in terminal)

-Install Homebrew using Terminal with the following command
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

-Intstall Xcode

-Under "Xcode" select "Preferences" then navigate to the "Locations" tab check that Command Line Tools is not blank

-Install Node and Watchman using hte following Commands
brew install node
brew install watchman

-Install Cocoapods
brew install cocoapods
sudo gem install ffi

-Using your terminal or IDE (I used VSCode with Github Extension) clone the repository from Github using the following link
https://github.com/shaquille-hall/se691-conversational-agent.git

-Add the env.js file posted in Slack (this link should work) and place it under the Chatbot folder
https://se691-softwarestudio.slack.com/files/U02H3C0T3LG/F02K7RD1YVB/env.js

-Change directory into the folder you cloned it to and install npm dependencies
cd 'folder installed to'
cd se691-conversational-agent/Chatbot/
npm install

-cd back into the Chatbot and into ios (the previous npm install always kicks me out of the directory) then pod install (results: https://imgur.com/a/KAiisnK)
cd se691-conversational-agent/Chatbot/ios
pod install

-cd back into the Chatbot and into ios (the previous pod install kicks me out of the directory, you can doublehcedk you are still in it with the "ls" command)
cd se691-conversational-agent/Chatbot/ios

-Open iPhone Simulator under "Xcode" select "Open Developer Tool" and select "Simulator" (I would then recommend closing Xcode itself, according to some blogs)

-run the npx command to build the app and Deploy to simulator
npx react-native run-ios
