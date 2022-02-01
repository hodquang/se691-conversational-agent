# se691-conversational-agent

# Video Demonstration
https://youtu.be/6XhGoa4OO2w

# Folder Structure
- Chatbot: The main source code folder for the application
- Datasets: The dataset used to feed the agent. All the data has already been fed into DialogFlow Agent online.
- Webmining: The in-progress Python script for web scrapping online text into topics and sentences. Mainly look at WebMining.py file.

# How to view
- get into the root folder for Chatbot
- Open App.js to view the code
- If you get the keyboard.removeListener error. Delete them in the code! 
  - removeListener is in node-modules/react-native-gifted-chat/lib/MessageContainer.js
  - replace it with the following code (https://imgur.com/a/0AhVK3m)
# How to edit (VS Code)
- Open Terminal
- cd ~/Chatbot (just make sure you are in the root directory)
- code . (to open VS Code for edit)

# How to run (for MacOS)

- Install Homebrew using Terminal with the following command  
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

- Install Xcode  
Under "Xcode" select "Preferences" then navigate to the "Locations" tab check that Command Line Tools is not blank  

- Install Node and Watchman using the following Commands  
brew install node  
brew install watchman  

- Install Cocoapods  
brew install cocoapods  
sudo gem install ffi  

- Clone the repository from Github  
Using your terminal or IDE (I used VSCode with Github Extension)  
https://github.com/shaquille-hall/se691-conversational-agent.git  

- Change Directory to the Folder Cloned to    
cd 'folder installed to'  
cd se691-conversational-agent/Chatbot/  

- Install npm dependencies  
npm install  

- Change Directory back into the Chatbot and Into ios (the previous npm install always kicks me out of the directory)  
cd se691-conversational-agent/Chatbot/ios    

- Install Cocoapod Dependencies (results: https://imgur.com/a/KAiisnK)   
pod install  

- Update keyboard.removeListener in the code! 
  - removeListener is in node-modules/react-native-gifted-chat/lib/MessageContainer.js
  - replace it with the following code (https://imgur.com/a/0AhVK3m)

- Change path of avatar picture in lines 10-14 in SelectionScreen.js to properly view pictures of avatars. 

- Change Directory back into the Chatbot (pod install kicks me out as well)  
cd se691-conversational-agent/Chatbot/

- react-native run-ios (or npx react-native run-ios)
- react-native run-android (under "Xcode" select "Open Developer Tool" and select "Simulator")
- If the simulator doesn't show up, you can open the simulator manually with:
  - Xcode/iPhone Simulator
  - Android Studio (https://developer.android.com/studio/?gclid=CjwKCAjw_L6LBhBbEiwA4c46ukIoqLbJjZGt7VPSEXEXGdLBYnZbhEaUxM7AuPrho1QaXDcV82lonRoCGKEQAvD_BwE&gclsrc=aw.ds)

# How to run (for WindowsOS)

- Install Node.js and npm - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- Clone the repository from Github
- Install Android Studio (also install Android Virtual Device) - https://developer.android.com/studio
- In Android Studio download the Android 12.0 Sdk
- Open Chatbot in Android Studio
- Add a file local.properties to se691-conversational-agent\Chatbot\android with the path to your SDK (example below)
  - sdk.dir=C:\\Users\\user\\AppData\\Local\\Android\\Sdk
- If needed, click on the root node in the file tree
  - FILE -> PROJECT STRUCTURE
  - Project Settings -> Project -> Project SDK -> select an SDK
  - Project Settings -> Modules -> select + button -> Android -> OK
- Create a virtual device - https://developer.android.com/studio/run/managing-avds
  - Choose a phone with the play store available and run with Android 12
- Run the virtual device
- Run Powershell as Administrator
- cd to /Chatbot folder
- Run the following commands

  `npx npm install`
  
  `npx react-native run-android`
    - Between emulator launch and building app, should take about 5 minutes 

- Will have a Listener bug of some sort
