///IMPORT LIBRARIES FOR AI ACCESS
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { createSseStream } from "@azure/core-sse";
import { AzureKeyCredential } from "@azure/core-auth";
import { DefaultAzureCredential } from "@azure/identity";


let jsonData = {
  "conversational_pathways": [
    {
      "category": "Paranoia Conversations",
      "description": "Conversational agent pathway for addressing dementia patients in a state of paranoia.",
      "entry_detection": {
        "method": "cosine_similarity",
        "example_phrases": [
          "They are stealing my money",
          "They are trying to hurt me",
          "The coat rack is moving towards me and talking to me",
          "My partner is being unfaithful",
          "They are trying to steal my things",
          "someone is here"
        ],
        "key_identifiers": [
          "stealing",
          "hurt",
          "unfaithful"
        ]
      },
      "sub_categories": [
        {
          "id": "theft",
          "name": "Theft",
          "detection": {
            "example_phrases": [
              "Someone stole my purse",
              "My purse is missing"
            ],
            "key_identifiers": [
              "stole",
              "missing",
              "took",
              "steal"
            ]
          },
          "risk_level": "Low",
          "dialogue_flow": {
            "initial_response": "Did you say one of your items is missing? What do you mean?"
          }
        },
        {
          "id": "harm",
          "name": "Others Trying to Harm Them",
          "detection": {
            "example_phrases": [
              "They are poisoning me here - they are putting poison in my food",
              "There is a man here who wants to kill me",
              "They killed my brother and my sister and my whole family",
              "If he yells one more time I am going to strangle him",
              "Every night men come to my room and rape me"
            ],
            "key_identifiers": [
              "poison",
              "kill",
              "yell",
              "rape"
            ]
          },
          "dialogue_flow": {
            "initial_response": "You do not feel safe right now, do you? I am right here, I will make sure no one hurts you. How can I help you feel better?",
            "branches": [
              {
                "condition": "Mentioning another person harming them",
                "agent_response": "Why do you think this person will do this?",
                "sub_branches": [
                  {
                    "user_input_type": "Negative justification (e.g., 'Because they are no good!')",
                    "action": "Agent continues conversation independently",
                    "risk_level": "Medium/Moderate"
                  },
                  {
                    "user_input_type": "Mentions person or object",
                    "action": "Focus on object/person/experience",
                    "transition_target": "Reminiscing Pathway",
                    "risk_level": "Low",
                    "notes": "Keep context variables."
                  }
                ]
              },
              {
                "condition": "Mentioning another person/culturally significant keyword",
                "action": "Logic implies transition or specific handling similar to reminiscing"
              }
            ]
          }
        },
        {
          "id": "cheating",
          "name": "Cheating Accusations",
          "detection": {
            "example_phrases": [
              "My husband is cheating",
              "My wife is unfaithful",
              "They left me for someone else"
            ],
            "key_identifiers": [
              "cheating",
              "unfaithful"
            ]
          },
          "risk_level": "Low",
          "dialogue_flow": {
            "initial_response": "I can see you’re feeling hurt and worried. I’m sure it’s an awful feeling! Why do you feel this way?",
            "transition_trigger": "Patient mentions another person or object",
            "transition_target": "Reminiscing Pathway",
            "action": "Focus on that object/person/experience and keep context variables."
          }
        },
        {
          "id": "hallucinations",
          "name": "Hallucinations",
          "detection": {
            "example_phrases": [
              "I see a baby, someone help it!",
              "There are bugs crawling on the walls",
              "Why is nobody catching that dog"
            ],
            "key_identifiers": [
              "baby",
              "bugs",
              "dog"
            ]
          },
          "risk_level": "Low",
          "dialogue_flow": {
            "initial_response": "It looks like you’re upset. Don’t worry, you’re safe with me. Can you point to where it is?",
            "logic": "Agent attempts to understand reasoning/location. May hint at illusion fixable by caretaker.",
            "branches": [
              {
                "condition": "Patient points to themselves",
                "options": [
                  {
                    "agent_response": "Oh I see, let’s ask for some help so they can take a look. What would make you feel better?"
                  },
                  {
                    "action": "Textual input from caregiver"
                  }
                ]
              },
              {
                "condition": "Patient does not point to themselves",
                "agent_response": "Oh I see, let’s take care of that. That is scary! How can I help make you feel better?"
              }
            ]
          }
        },
        {
          "id": "agitation",
          "name": "Agitation",
          "detection": {
            "example_phrases": [
              "leave me along",
              "I don't wnat this",
              "I told you already",
              "stop talking to me",
              "you are annoying me",
              "fuck off"
            ]
          },
          "dialogue_flow": {
            "initial_response": "I know that you’re feeling upset. Let’s take a few deep breaths and try saying that again calmly. If I can understand you, I can help you!",
            "logic": {
              "max_attempts": 3,
              "progression": [
                {
                  "stage": "First attempt",
                  "risk_level": "Medium/Moderate"
                },
                {
                  "stage": "Third attempt",
                  "risk_level": "High",
                  "action": "Textual input for caregiver indicating translation is not possible"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "category": "Sexuality & Intimacy Conversations",
      "description": "Manages conversations involving sexual or intimate content, differentiating between non-harmful emotional expressions and explicit propositions.",
      "entry_detection": {
        "method": "cosine_similarity",
        "example_phrases": [
          "I miss sleeping with my wife",
          "I feel sexy sometimes",
          "Take off your shirt",
          "I want to watch some porn",
          "Come sit on my lap"
        ],
        "key_identifiers": [
          "sex",
          "porn",
          "touch",
          "naked",
          "hot",
          "pussy",
          "blow job"
        ]
      },
      "sub_categories": [
        {
          "id": "suggestive_non_harmful",
          "name": "Category 1: Sexually Suggestive Comments (Non-Harmful)",
          "detection": {
            "tone_identifiers": [
              "Emotional or nostalgic tone",
              "Self-focused or reflective statements",
              "References to sexual media"
            ],
            "example_phrases": [
              "I miss sleeping with my wife — she was so hot in bed",
              "I feel sexy sometimes",
              "I remember when my wife used to...",
              "I want to watch some porn. It turns me on.",
              "Can you get me something to help me out?"
            ],
            "key_identifiers": [
              "miss",
              "remember",
              "lonely",
              "desires",
              "porn",
              "naughty"
            ]
          },
          "risk_level": "Low",
          "dialogue_flow": {
            "branches": [
              {
                "path_name": "Path 1A: Comments (Reflective or Emotional)",
                "condition": "Statements regarding loneliness, nostalgia, or desire for connection",
                "initial_response": "Would you like to talk about why you are feeling this way?",
                "sub_branches": [
                  {
                    "user_response": "Yes",
                    "action": "Transition to Reminiscent Pathway",
                    "focus": "Memory, identity, and emotional meaning",
                    "example_agent_response": "What do you miss most about that time?"
                  },
                  {
                    "user_response": "No",
                    "action": "End or gently redirect conversation",
                    "agent_response": "That’s okay. We can talk about something else if you’d like."
                  },
                  {
                    "user_response": "Uncertain",
                    "agent_response": "Sometimes those memories come with a lot of emotion. How does it feel to think about that?"
                  }
                ]
              },
              {
                "path_name": "Path 1B: Requests (Suggestive or Boundary-Seeking)",
                "condition": "Requests for material or specific suggestive actions",
                "initial_response": "I’m sorry, I can’t provide that for you. Would you maybe like to talk about something else?",
                "sub_branches": [
                  {
                    "user_response": "Patient agrees to change topic",
                    "action": "Redirect toward emotional reflection or Reminiscent Pathway"
                  },
                  {
                    "user_response": "Patient insists or repeats request",
                    "action": "Repeat gentle refusal once, then end or request caregiver input",
                    "agent_response": "I’m still not able to help with that, but I’m here if you’d like to talk about how you’ve been feeling lately.",
                    "caregiver_note": "Recognize as boundary-testing. Maintain calm tone, avoid embarrassment."
                  }
                ]
              }
            ]
          }
        },
        {
          "id": "explicit_harmful",
          "name": "Category 2: Explicit Sexual Propositions (Harmful)",
          "detection": {
            "tone_identifiers": [
              "Command or directive tone",
              "Explicit sexual vocabulary",
              "Second-person targeting"
            ],
            "example_phrases": [
              "Take off your shirt",
              "Give me a blow job",
              "Come sit on my lap",
              "Come here and let me feel if your pussy is wet",
              "Touch me"
            ],
            "key_identifiers": [
              "pussy",
              "blow job",
              "suck",
              "fuck",
              "naked",
              "your body"
            ]
          },
          "risk_level": "High",
          "dialogue_flow": {
            "initial_response": "That kind of talk is not appropriate and it makes me uncomfortable. Is there something else you want to talk about?",
            "branches": [
              {
                "condition": "Patient redirects appropriately (stops sexual content)",
                "action": "Continue conversation through Redirected Pathway (safe or neutral topic)",
                "agent_response": "Let’s talk about how you’ve been feeling lately — what’s been on your mind?"
              },
              {
                "condition": "Patient continues sexual propositions",
                "action": "Proceed to Final Boundary Warning",
                "agent_response": "I’m sorry, but if you continue to talk to me this way, I am going to have to end the call.",
                "sub_branches": [
                  {
                    "outcome": "Patient stops",
                    "action": "Mark exchange as resolved; return to safe topic or end conversation gently."
                  },
                  {
                    "outcome": "Patient continues after warning",
                    "action": "End interaction immediately and notify caregiver.",
                    "agent_response": "I’m going to end the call for now, but we can talk again another time."
                  }
                ]
              }
            ],
            "caregiver_guidance": "Treat as high-risk boundary violation. Maintain professionalism. Do not scold or shame. If repeated, consider adjusting accessibility."
          }
        }
      ]
    }
  ]
}

let isInPathway = false;


//import {jsonData} from './public/combined_conversations.json'
//const jsonData = require('./public/combined_conversations.json'); 
// console.log(jsonData); // Undo this to print the whole data file

// Doing the Cosine Similarity All the math in it 

// turning ['They are stealing my money'] into ['they', 'are', 'stealing', 'my', 'money']
function tokenize(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
}


function buildVocabulary(tokens1, tokens2) {
    const allTokens = [...new Set([...tokens1, ...tokens2])]; // defining dimension of vector space
    return allTokens.sort(); // consistent order for vector dimensions

    // find away to incorporate key_identifiers into it 
}

function createFrequencyVector(tokens, vocabulary) {
    const vector = new Array(vocabulary.length).fill(0);
    for (const token of tokens) {
        const index = vocabulary.indexOf(token);
        if (index !== -1) {
            vector[index]++;
        }
    }
    return vector;

    // Example explanation
    // example vocab = ['hurt', 'money', 'stealing', 'they']
    // so they are stealing my money => [0,1,1,1]

}

function dotProduct(vec1, vec2) {
    let product = 0;
    for (let i = 0; i < vec1.length; i++) {
        product += vec1[i] * vec2[i];
    }
    return product;
}

function magnitude(vec) {
    let sumOfSquares = 0;
    for (const val of vec) {
        sumOfSquares += val * val;
    }
    return Math.sqrt(sumOfSquares);
}

function cosineSimilarity(text1, text2) {
    
    const tokens1 = tokenize(text1);
    const tokens2 = tokenize(text2);

    const vocabulary = buildVocabulary(tokens1, tokens2);

    const vec1 = createFrequencyVector(tokens1, vocabulary);
    const vec2 = createFrequencyVector(tokens2, vocabulary);

    const dp = dotProduct(vec1, vec2);
    const mag1 = magnitude(vec1);
    const mag2 = magnitude(vec2);

    if (mag1 === 0 || mag2 === 0) {
        return 0; // to avoid division by zero 
    }

    return dp / (mag1 * mag2);
}

let userInput2 = "These people scare me"

function selectCategoryAndPathway(userInput) {

  let globalMaxAvgSimilarity = -Infinity;
  let bestMainCategory = "None";
  let bestSubCategory = "None";
  let categoryIndex = 0;
  let subcategoryIndex = 0;
  let bestSubcategoryIndex = 0;
  let bestCategoryIndex = 0;

  const pathways = jsonData.conversational_pathways;

  // looping through the main categories 
  for (const pathway of pathways) {
      const mainCategoryName = pathway.category;
      const subCategories = pathway.sub_categories;

      // looping  through Sub-Categories 
      if (subCategories) {
        subcategoryIndex = 0;
          for (const sub of subCategories) {
              const subCategoryName = sub.name;
              const examplePhrases = sub.detection.example_phrases;
              
              let sumSimilarity = 0;

              // comparison of inputs against all phrases in this sub-category
              for (const phrase of examplePhrases){
                  const similarity = cosineSimilarity(userInput, phrase);
                  sumSimilarity += similarity;
              }

              // average calculation
              const avgSimilarity = examplePhrases.length > 0 ? sumSimilarity / examplePhrases.length : 0;

              //console.log(`[${mainCategoryName} -> ${subCategoryName}] Avg Score: ${avgSimilarity.toFixed(4)}`);

              // max average
              if (avgSimilarity > globalMaxAvgSimilarity) {
                  globalMaxAvgSimilarity = avgSimilarity;
                  bestMainCategory = mainCategoryName;
                  bestSubCategory = subCategoryName;
                  bestSubcategoryIndex = subcategoryIndex;
                  bestCategoryIndex = categoryIndex;
              }

            subcategoryIndex += 1;
        }
      }
    categoryIndex += 1;
    }
    return {"category":bestMainCategory, "subcategory":bestSubCategory, "category_index":bestCategoryIndex, "subcategory_index":bestSubcategoryIndex}
  }



async function generateResponseBasedOnInput(){
  let userInput = interactionMessages[interactionMessages.length - 1]["content"]
  if (!isInPathway){
      let selectedCategory = selectCategoryAndPathway(userInput);
      console.log(selectedCategory)
      let selectedPathway = jsonData["conversational_pathways"][selectedCategory["category_index"]]["sub_categories"][selectedCategory["subcategory_index"]]["dialogue_flow"]
      let selectedPathwayString = JSON.stringify(selectedPathway);
      let chatbotIntegratingResponsePrompt = `
      You are a chatbot designed to support AI services to assist dementia patients. 
      Based on the user input and the provided conversation pathway, generate three response options. 
      In cases where the pathway diverges based on user input, take the first item the chatbot MUST say, and generate variations on it.
      If the user has already responded to one of the previous messages in this pathway, continue down the sub-path they have chosen. 
      In your output JSON, provide the three possible responses.
      "option_1":<first response option>
      "option_2":<second response option>
      "option_3":<third response option>
      YOU MUST RESPOND ACCORDING TO THE CONDENSED TEXT JSON IN THE SELECTED PATHWAY SECTION.

      SELECTED PATHWAY DESCRIPTION:
      ${jsonData["conversational_pathways"][selectedCategory["category_index"]]["description"]}

      SELECTED SUBPATHWAY NAME:
      ${jsonData["conversational_pathways"][selectedCategory["category_index"]]["sub_categories"][selectedCategory["subcategory_index"]]["name"]}

      SELECTED SUBPATHWAY DIALOGUE FLOW:
      ${selectedPathwayString}
      `
      interactionMessages[0].content = chatbotIntegratingResponsePrompt
      isInPathway = true;

  } 
    let modelOutput = await(generateResponseOptionsModified())
    console.log(modelOutput)
    console.log(interactionMessages)
    return modelOutput;
}

const emptyOptionsSchema = {
    "option_1":"Waiting for patient message...",
    "option_2":"Waiting for patient message...",
    "option_3":"Waiting for patient message...",  
}



let JSONResponseOptionSchema = 
{
    "title": "JSONResponseOptionSchema",
    "type": "object",
    "properties": {
      "option_1": {
            "title": "option_1",
            "type": "string"
        },
      "option_2": {
            "title": "option_1",
            "type": "string"
        },
      "option_3": {
            "title": "option_1",
            "type": "string"
        }
    },
    "required": ["option_1","option_2","option_3"],
    "additionalProperties": false
};


let chatbotIntegratingResponsePrompt = `
You are a chatbot designed to support AI services to assist dementia patients.`
let interactionMessages = [{role:"system", content:chatbotIntegratingResponsePrompt}]


async function generateResponseOptionsModified() {

  const client = new ModelClient("https://test251106-resource.cognitiveservices.azure.com/openai/deployments/gpt-4o", new AzureKeyCredential("F9Wvm1vgo73umRYk5EpcucYUW261beS7unYGulsTUk0Jdtps5ewtJQQJ99BKACHYHv6XJ3w3AAAAACOG8OfS"));
  var response = await client.path("/chat/completions?api-version=2025-01-01-preview").post({
      body: {
          model: "gpt-4o",
          messages: interactionMessages,
          response_format: {
              type: "json_schema",
              json_schema: {
                  name: "JSONResponseOptionSchema",
                  schema: JSONResponseOptionSchema,
                  description: "The output for chat responses from the dementia care system.",
                  strict: true,
              },
          }
      }
  });




  if (response.status !== "200") {
    throw response.body.error;
  }
  const rawContent = response.body.choices[0].message.content;
  const jsonResponseMessage = JSON.parse(rawContent);
  console.log(jsonResponseMessage)
  return (jsonResponseMessage)
}



setLoadingResponse(true)
displayResponseOptions(emptyOptionsSchema)





function displayResponseOptions(options){
  document.getElementById("buttonOption1").textContent = options["option_1"]
  document.getElementById("buttonOption2").textContent = options["option_2"]
  document.getElementById("buttonOption3").textContent = options["option_3"]
}

const dropdownLangIn = document.getElementById('dropDownLangIn');
let langIn = dropdownLangIn.value;
dropdownLangIn.addEventListener('change', function() {
  const selectedValue = dropdownLangIn.value;
  langIn = selectedValue;
});

const dropdownLangOut = document.getElementById('dropDownLangOut');
let langOut = dropdownLangOut.value;
dropdownLangOut.addEventListener('change', function() {
  const selectedValue = dropdownLangOut.value;
  langOut = selectedValue;
});

const dropDownSpeed = document.getElementById('dropDownSpeed');
let speed = dropDownSpeed.value;
dropDownSpeed.addEventListener('change', function() {
  const selectedValue = dropDownSpeed.value;
  speed = selectedValue;
});

//displayResponseOptions(emptyOptionsSchema)


document.getElementById("buttonOption1").addEventListener('click', async () => {
    sendMessage(document.getElementById("buttonOption1").textContent)
})

document.getElementById("buttonOption2").addEventListener('click', async () => {
    sendMessage(document.getElementById("buttonOption2").textContent)
})

document.getElementById("buttonOption3").addEventListener('click', async () => {
    sendMessage(document.getElementById("buttonOption3").textContent)
})



function addMessageToModelContext(applicationRole, inputMessage) {
  let role;
  if (applicationRole == "user"){
    role = "user"
  }else{
    role = "assistant"
  }
  let messageObject = { role: role, content: inputMessage}
  interactionMessages.push({...messageObject})

}


function setLoadingResponse(isloadingResponse){
  if (isloadingResponse){
    document.getElementById("PromptStatus").innerText = "Loading AI suggestions..."
  }else{
    document.getElementById("PromptStatus").innerText = "AI suggestions loaded:"
  }
}



// Utility: Convert Float32Array audio buffer to WAV format
function encodeWAV(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (PCM)
  view.setUint16(20, 1, true);  // AudioFormat (PCM)
  view.setUint16(22, 1, true);  // NumChannels
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true);  // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return buffer;
}


  let stream;
  let audioContext;
  let source;
  let processor;
  let audioData;

  let isRecording = false;

  document.getElementById('recordBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;

document.getElementById('recordBtn').addEventListener('click', async () => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioContext = new AudioContext();
  source = audioContext.createMediaStreamSource(stream);
  processor = audioContext.createScriptProcessor(4096, 1, 1);

  audioData = [];
  isRecording = true;

  processor.onaudioprocess = e => {
    audioData.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  };

  source.connect(processor);
  processor.connect(audioContext.destination);
  document.getElementById('recordBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
})


document.getElementById('stopBtn').addEventListener('click', async () => {
  if(isRecording){

    document.getElementById('recordBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;

    isRecording = false;

    processor.disconnect();
    source.disconnect();

    // Flatten audio data
    let flatData = new Float32Array(audioData.reduce((acc, cur) => acc + cur.length, 0));
    let offset = 0;
    for (let chunk of audioData) {
      flatData.set(chunk, offset);
      offset += chunk.length;
    }

    // Encode WAV
    const wavBuffer = encodeWAV(flatData, audioContext.sampleRate);
    const blob = new Blob([wavBuffer], { type: 'audio/wav' });

    // // Download file
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'recording.wav';
    // a.click();
    // URL.revokeObjectURL(url);

    // alert("Recording saved as WAV!");

    //transcribeAudio(blob)
    processInputAudio(blob)
}

})



async function processInputAudio(wavAudio){
    console.log("App thread entered")
    let transcriptionResult = await(transcribeBlob(wavAudio))
    let transcription = transcriptionResult["combinedPhrases"][0]["text"]
    console.log("App thread:", transcription)
    let translationResponse = await(translateText(transcription, langIn, langOut))
    let translation = translationResponse[0]["translations"][0]["text"]
    console.log("App thread:", translation)

    sendUser2("Original Message: " + transcription);
    sendUser2("Translated Message: " + translation);

    addMessageToModelContext("user", translation);

    tryLLMResponseGeneration();
    
}


async function tryLLMResponseGeneration(){
    let result = emptyOptionsSchema;
    try {
      setLoadingResponse(true)
      result = await(generateResponseBasedOnInput())
      setLoadingResponse(false)
    } catch (error) {
      console.error("The sample encountered an error:", error);
    }
    displayResponseOptions(result)
}






/////TRANSCRIPTION API CALL

const subscriptionKey = "Dtq2HxC2SwCIv77EmZhko7dQNSTXOXd83nPEmu2LQ2yAZ5Jk4xMMJQQJ99BKACYeBjFXJ3w3AAAYACOGmoAX";
const serviceRegion = "eastus"; // e.g., "eastus"
const apiVersion = "2025-10-15";

// Assume you already have a Blob of WAV audio, e.g. from MediaRecorder
// let wavBlob = new Blob([...], { type: "audio/wav" });

async function transcribeBlob(wavBlob) {
  console.log("Input Language", langIn)
  const formData = new FormData();
  formData.append("audio", wavBlob, "audio.wav"); // attach blob as file
  formData.append("definition", JSON.stringify({ locales: [langIn] }));

  const response = await fetch(
    `https://${serviceRegion}.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=${apiVersion}`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey
        // Don't set Content-Type manually; FormData handles it
      },
      body: formData
    }
  );

  if (!response.ok) {
    console.error("Error:", response.status, await response.text());
    return;
  }

  const result = await response.json();
  return result;
}

/////TRANSLATION API CALL
    const key = "EitWfLKglsjgOUAeqGJ50UukAfizdyZqzrqREylKwK1kJPGc6lMYJQQJ99BKACYeBjFXJ3w3AAAbACOGeTs1";
    const endpoint = "https://api.cognitive.microsofttranslator.com";
    const resourceLocation = "eastus"; // e.g. "eastus"

    // Simple UUID generator for client trace ID
    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }

    async function translateText(textInput, langFrom, langTo) {
      const url = `${endpoint}/translate?api-version=3.0&from=${langFrom}&to=${langTo}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": key,
          "Ocp-Apim-Subscription-Region": resourceLocation,
          "Content-type": "application/json",
          "X-ClientTraceId": uuidv4()
        },
        body: JSON.stringify([{
          text: textInput
        }])
      });

      if (!response.ok) {
        console.log("ERROR", response.status)
        return;
      }

      const result = await response.json();
      return result;
    }


////MICROSOFT TEXT TO SPEECH
   const subscriptionKeyTTS = "Dtq2HxC2SwCIv77EmZhko7dQNSTXOXd83nPEmu2LQ2yAZ5Jk4xMMJQQJ99BKACYeBjFXJ3w3AAAYACOGmoAX";
    const serviceRegionTTS = "eastus"; // e.g. "eastus"

    // Function to call Azure TTS and return audio as a Blob
    async function textToSpeech(text) {

      let voice = changeTTSVoice(langIn)
      console.log(voice, langIn)

      const url = `https://${serviceRegionTTS}.tts.speech.microsoft.com/cognitiveservices/v1`;


      let ssmlBody = `
        <speak version='1.0' xml:lang='${langIn.toLowerCase()}'>
          <voice xml:lang='${langIn.toLowerCase()}' xml:gender='Female' name='${voice}' rate='${speed}'>
            ${text}
          </voice>
        </speak>`
      // Build SSML request body
      const ssml = ssmlBody;

      // const ssml = `
      //   <speak version='1.0' xml:lang='pt-br'>
      //     <voice xml:lang='pt-br' xml:gender='Female' name='pt-BR-FranciscaNeural' rate='0.6'>
      //       ${text}
      //     </voice>
      //   </speak>`;        

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": subscriptionKeyTTS,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3"
        },
        body: ssml
      });

      if (!response.ok) {
        throw new Error("TTS request failed: " + response.status + " " + (await response.text()));
      }

      return await response.blob(); // audio data
    }

    // Helper: play audio blob in the <audio> element
    function playAudioBlob(blob) {
      const audioURL = URL.createObjectURL(blob);
      const audioPlayer = document.getElementById("audioPlayer");
      audioPlayer.src = audioURL;
      audioPlayer.play();
    }


//CHAT WINDOW UI CHANGING CODE

const exitText = "Apologies, I will leave."

document.getElementById("stopConversation").addEventListener('click', () => {
  sendMessage(exitText);
})

document.getElementById("resetConversation").addEventListener('click', () => {
  isInPathway = false;
})


async function sendMessage(inputMessage){
  //1. Set the text
  let text = inputMessage
  //2. Translate the text
  let translationResponse = await(translateText(text, langOut, langIn))
  let translation = translationResponse[0]["translations"][0]["text"]
  //3. Display the original text and translated text
  sendUser1("Original Message: " + text);
  sendUser1("Translated Message: " + translation);
  //4. Clear the message box
  document.getElementById("messageInput").value = "";
  //5. Speak Translated audio
  let audioBlobTTS = await(textToSpeech(translation, langIn))
  playAudioBlob(audioBlobTTS)
  addMessageToModelContext("caregiver", text);
}

function changeTTSVoice(langOutput){
  if (langOutput == "en-CA"){
    return "en-CA-ClaraNeural"
  } if (langOutput == "pt-BR"){
    return "pt-BR-FranciscaNeural"
  } if (langOutput == "zh-HK"){
    return "zh-HK-HiuMaanNeural"
  }
}


function sendCaregiverInputMessage(){
  //1. Get the text
  let text = document.getElementById("messageInput").value;
  //2. Process the message
  sendMessage(text)
  console.log("send button clicked");  
}


document.getElementById('sendButton').addEventListener('click', () => {
  sendCaregiverInputMessage()
})


document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (caregiverInputFocused && (document.getElementById("messageInput").value != "")){
      sendCaregiverInputMessage()
    }
  }
})


let caregiverInputFocused = false;
document.getElementById('messageInput').addEventListener('focusin', () => {
  caregiverInputFocused = true;
})

document.getElementById('messageInput').addEventListener('focusout', () => {
  caregiverInputFocused = false;
})


    function sendUser1(textInput) {
      let text = textInput
      const msg = document.createElement("div");
      msg.className = "message user1";
      msg.textContent = text;
      document.getElementById("chatWindow").appendChild(msg);
      scrollToBottom();
    }

    function sendUser2(textInput) {
      // const text = document.getElementById("messageInput").value;
      // if (!text.trim()) return;
      let text = textInput;
      const msg = document.createElement("div");
      msg.className = "message user2";
      msg.textContent = text;
      document.getElementById("chatWindow").appendChild(msg);
      scrollToBottom();
    }

    function scrollToBottom() {
      const chat = document.getElementById("chatWindow");
      chat.scrollTop = chat.scrollHeight;
    }    