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


# Setup From Scratch on M1 w/ Rosetta (similar to non-M1)

-Install Homebrew using Terminal with the following command  
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

-Install Xcode  
Under "Xcode" select "Preferences" then navigate to the "Locations" tab check that Command Line Tools is not blank  

-Install Node and Watchman using the following Commands  
brew install node  
brew install watchman  

-Install Cocoapods  
brew install cocoapods  
sudo gem install ffi  

-Clone the repository from Github  
Using your terminal or IDE (I used VSCode with Github Extension)  
https://github.com/shaquille-hall/se691-conversational-agent.git  

-Add the env.js file  
Download it and place it in the Chatbot folder  
https://se691-softwarestudio.slack.com/files/U02H3C0T3LG/F02K7RD1YVB/env.js    

-Change Directory to the Folder Cloned to    
cd 'folder installed to'  
cd se691-conversational-agent/Chatbot/  

-Install npm dependencies  
npm install  

-Change Directory back into the Chatbot and Into ios (the previous npm install always kicks me out of the directory)  
cd se691-conversational-agent/Chatbot/ios    

-Install Cocoapod Dependencies (results: https://imgur.com/a/KAiisnK)   
pod install  

-Change Directory back into the Chatbot (pod install kicks me out as well)  
cd se691-conversational-agent/Chatbot/  

-Open iPhone Simulator under "Xcode" select "Open Developer Tool" and select "Simulator"  
(I recommend closing Xcode itself, according to some blogs)  

-Deploy to Simulator  
npx react-native run-ios
