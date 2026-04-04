# Call_Center_Compliance

## Description

Checking call center compliance using Gemini AI with Node.JS backend.
Once the audio is converted into base64 format and make a API request with it, Gemini-3-Flash modal base64 will devour the base64 and Responds for questions asked(Embeded in sechema) in JSON format.

## Tech Stack

### Language/Framework:

- Node.JS
- Express.js

### Key libraries

- google/generative-ai

### LLM/AI models used:

- gemini-3-flash-preview

### AI Tools Used to build:
- Google Gemini : for understanding error logs and how to communicate with gemini-3-flash-preview

## Setup Instructions

1. Clone the repository <br>
   `git clone git@github.com:vigasselvan/Call_Center_Compliance.git`
2. Prerequisites
   1. Things you need to use the software and how to install them <br>
      `npm install npm@latest -g`
   2. Change git remote url to avoid accidental pushes to base project <br>
      `git remote set-url origin github_username/repo_name` <br>
      `git remote -v # confirm the changes`
3. Install dependencies:
   1. `cd src` - go inside src folder.
   2. run `npm i` - install all dependency packages using NPM.
4. Set environment variables:
   1. `cd src` - go inside src folder.
   2. create new file called `config.env`
   3. We need 3 key: `PORT`, `YOUR_SECRET_API_KEY` and `GEMINI_API_KEY`
      1. set `PORT` and `YOUR_SECRET_API_KEY` values same as in `.env.example` file in root directory.
      2. to get Gemini API: search in browser "google ai studio", Login and create a new API key, copy it and paste in `GEMINI_API_KEY` value.
5. Run the application
   1. `cd src` - go inside src folder from root.
   2. Run `npm start` to run the application in port 5050.
   3. Wait for output, will generate in 10-20 seconds in console.
6. API Request (cURL Example)<br>
   Endpoint Example: POST https://localhost:5050/api/call-analytics
   cURL Request:

```
curl -X POST https://your-domain.com/api/call-analytics \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_track3_987654321" \
  -d '{
    "language": "Tamil",
    "audioFormat": "mp3",
    "audioBase64": "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU2LjM2LjEwMAAAAAAA..."
  }'
```

Convert the audio file to base64(use base64.guru) and insert in value of `audioBase64`

## Live URL:
Application is live on https://call-center-compliance.vercel.app/

>[!Note]
> you can make request `POST https://call-center-compliance.vercel.app/api/call-analytics` in API Clients like cURL/postman.


## Usage

### When to use:

If you need to check how effective the call center team is compliant to the SOP and identify customer satisfaction in the interaction,

### How to use:

we can intergrate the code in your Application and use gemini to perform the complaiance check at very minimal cost.

### Why to use:

Use AI to perform compliance check and acheive :

- Make AI perform all complaiance check with just one request, so very minimal cost.
  **_Processing 5 minutes of audio with gemini-3-flash-preview costs about $0.0096 USD only, based on April 2026 prices._**
- customer's grievance, feedback, sales, troubleshooting calls won't go unheard.
- Every Calls are monitored and analysed, so the response from Call center will be to the standard.
- Managers can monitor their subordinates work and otuput instantly, so good work will be appreciated.
- Can design dashboard of the JSON output from AI, so Employees using it can visualize their performance in instant manner.
- Low maintance of code, whenever new modal is realeased, just changing one line of code will upgrade the app to new modal.

## Contact

Vigas BS - &nbsp;[Link to LinkedIn](https://www.linkedin.com/in/vigas-selvan/) <br>
&emsp;&emsp;&emsp;&emsp;&emsp;[Link to Portfolio Website](https://vigasbs.site/)

Project Link - https://github.com/vigasselvan/Call_Center_Compliance