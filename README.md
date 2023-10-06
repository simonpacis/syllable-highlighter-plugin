# Syllable Highlighter Plugin 

This is a plugin for Obsidian.

When enabled, it highlights parts of words using the following rules:

- If word has 1-2 syllables:
    - If word length is > 7: highlight first three letters
    - If word length is > 3 & < 7: highlight first two letters
    - If word length is <= 3: highlight first letter
- If word has 3 syllables or greater:
    - If word length is < 12: highlight first four letters
    - If word length is >= 12: highlight first five letters

See screenshot below.

<img width="1680" alt="Screenshot 2023-10-06 at 8 11 11 AM" src="https://github.com/nothingislost/obsidian-cm6-attributes/assets/7118482/bdc681ac-cb28-4aec-a668-b6518e7bd963">

Enable it by clicking on the "Dice" button in the ribbon.
Disable it by clicking on it again.

# Installation
### Via BRAT
- Install BRAT from Community Plugins in Obsidian
- Open Command Palette and run the command "BRAT: Add a beta plugin for testing"
- Use the following link: https://github.com/simonpacis/syllable-highlighter-plugin
- Click "Add Plugin"
- Go to Community Plugins, refresh, and enable Angry Reviewer

