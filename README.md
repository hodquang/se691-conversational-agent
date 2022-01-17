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
  + Xcode/iPhone Simulator
  + Android Studio (https://developer.android.com/studio/?gclid=CjwKCAjw_L6LBhBbEiwA4c46ukIoqLbJjZGt7VPSEXEXGdLBYnZbhEaUxM7AuPrho1QaXDcV82lonRoCGKEQAvD_BwE&gclsrc=aw.ds)
