///IMPORT LIBRARIES FOR AI ACCESS
import ModelClient from "@azure-rest/ai-inference";
import { isUnexpected } from "@azure-rest/ai-inference";
import { createSseStream } from "@azure/core-sse";
import { AzureKeyCredential } from "@azure/core-auth";
import { DefaultAzureCredential } from "@azure/identity";



let reminiscenceContext = 
`
Holidays

Holiday 1: New Year’s Day – A national public holiday marking the beginning of the year, often accompanied by family gatherings and closures of businesses and schools.

Holiday 2: Labour Day (May 1) – A public holiday recognising workers’ rights, commonly observed with reduced business activity.

Holiday 3: Portugal Day (June 10) – Celebrates Portuguese national identity and history, honouring the poet Luís de Camões.

Holiday 4: Republic Day (October 5) – Commemorates the establishment of the Portuguese Republic in 1910.

Holiday 5: Independence Restoration Day (December 1) – Marks Portugal’s restoration of independence from Spain in 1640.

Holiday 6: Carnival (February) – A festive period with lively parades, costumes, music, and dancing across cities.

Holiday 7: Festa de São João (June 23, Porto) – Famous for street parties, grilled sardines, fireworks, and communal celebrations.

Holiday 8: Feira Nacional do Cavalo (November, Golegã) – A traditional equestrian fair celebrating Portugal’s strong horse-riding culture.

Holiday 9: Semana Santa (Holy Week) – Marked by religious processions, particularly in Braga and Porto, reflecting Catholic traditions.

Holiday 10: Fantasporto (February/March) – A well-known independent film festival in Porto, highlighting arts and modern cultural expression.

Food

Food 1: Bacalhau (salted cod) – A national staple prepared in numerous ways (grilled, baked, stewed), representing Portugal’s strong seafood heritage.

Food 2: Pastel de Nata – A famous custard tart pastry widely enjoyed as a traditional dessert or snack.

Food 3: Caldo Verde – A traditional soup made with kale, potatoes, and chorizo, commonly served in family settings.

Food 4: Bacalhau à Brás – Shredded cod mixed with eggs, onions, and thin fried potatoes.

Food 5: Bifana – A pork sandwich seasoned with garlic and spices, commonly found in street food culture.

Food 6: Grilled Sardines – Especially popular in summer festivals, symbolising seasonal Portuguese cuisine.

Food 7: Bread and Pastries – Staple everyday foods reflecting regional baking traditions.

Music & Media

Music 1: Fado – A melancholic and deeply emotional music genre from Lisbon expressing saudade (wistful longing).

Music 2: Cante Alentejano – A regional vocal tradition from Alentejo, performed without instruments.

Music 3: Folk Music and Dance – Traditional forms expressing Portuguese identity and rural cultural memory.

Music 4: Modern Portuguese Music – Includes pop, electronic, metal, and fusion genres influenced by global trends.

Music 5: Azulejos and Traditional Arts – Hand-painted tiles and crafts reflecting historical heritage.

Media 1: Television Broadcasting – Introduced in 1957, with strong ongoing viewership despite streaming platforms.

Media 2: Digital TV and Cable Services – Widely used due to limited terrestrial options.

Religion

Religion 1: Catholicism – The dominant religion, with around 80% of the population identifying as Roman Catholic.

Religion 2: Pilgrimages to Fátima – A major religious practice reflecting national spiritual devotion.

Religion 3: Village Church Festivals – Important local traditions tied to saints’ feast days.

Religion 4: Secular State Structure – Since 1974, Portugal has constitutional separation of church and state with religious freedom.

Major Regions & Cities

Region 1: Lisbon – Capital and largest city, cultural and economic hub.

Region 2: Porto – Northern city known for wine production and historical architecture.

Region 3: Algarve – Southern coastal region famous for beaches and tourism.

Region 4: Azores – Autonomous island region with volcanic landscapes.

Region 5: Madeira – Autonomous region known for subtropical climate and natural beauty.

Region 6: Alentejo – Known for rural landscapes and traditional lifestyles.

Region 7: North & Centre – Regions rich in historical towns and cultural heritage.

City 1: Vila Nova de Gaia – One of the most populated cities, located near Porto.

Tourist Spot 1: Sintra – Known for castles, palaces, and UNESCO heritage sites.

Tourist Spot 2: Douro Valley – Famous for wine production and scenic river views.

Tourist Spot 3: Fátima – Major pilgrimage destination.

Childhood Games

Game 1: Blind Goat – A blindfolded tag game promoting coordination and playfulness.

Game 2: Elastic Jumping – A rhythmic jumping game involving group participation.

Game 3: Hopscotch – A classic playground game encouraging balance and coordination.

Game 4: Malha – A traditional disc-throwing game rooted in local culture.

Game 5: Sack Races – Popular during festivals and school events.

Game 6: Spinning Tops – Traditional toy games passed through generations.

Game 7: Raiola – Coin-throwing game testing accuracy and skill.

Sports

Sport 1: Football (Soccer) – The most popular sport in Portugal, dominating national culture.

Sport 2: Futsal – Rapidly growing sport, especially popular among youth.

Sport 3: Cycling – Strong following, highlighted by the Volta a Portugal.

Sport 4: Surfing – Supported by Portugal’s long Atlantic coastline.

Sport 5: Golf – Popular recreational activity.

Sport 6: Bullfighting – Traditional but controversial cultural sport.

Sport 7: Athletics & Handball – Common competitive sports across the country.

History

History 1: Age of Discoveries – Portugal became a global maritime power in the 15th–16th centuries, establishing a vast empire.

History 2: Independence Declaration (1139) – Afonso I established Portugal as an independent nation.

History 3: Carnation Revolution (1974) – Ended the dictatorship and transitioned Portugal into democracy.

History 4: EU Membership (1986) – Marked significant economic and social modernisation.

History 5: Colonial Empire Decline – Loss of overseas territories led to political and economic change.

History 6: Roman, Moorish, and Celtic Influence – Shaped the early cultural identity of Portugal.
`


let jsonData = 

{
  "conversational_pathways": [
    {
      "category": "Paranoia Conversations",
      "category_description": "This pathway guides the conversational agent in responding to dementia patients experiencing paranoia, delusions, or perceptual misinterpretations, whether initiated by caregiver context or mid-conversation identifiers of fear, mistrust, or suspicion. Addressing subtypes such as theft, harm, cheating accusations, hallucinations, and agitation, the chatbot validates perceived danger without confrontation and prioritizes emotional safety. It uses semantic similarity to identify the specific issue and redirects to reminiscence or comfort pathways, escalating to caregiver intervention only if distress persists, while maintaining a soft, non-judgmental tone.",
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
          "subcategory_description":"This subcategory addresses delusions or suspicions that personal belongings have been stolen by identifying accusations of theft or claims of missing items. It detects specific complaints regarding misplaced possessions or direct allegations against others using key terms related to stealing or taking. The system triggers a response designed to maintain reassurance and redirect the conversation toward familiarity or reminiscence.",
          "detection": {
            "example_phrases": [
              "Someone stole my purse",
              "My purse is missing",
              "You took my things",
              "Did you steal my things"
            ],
            "key_identifiers": [
              "stole",
              "missing",
              "took",
              "steal"
            ]
          },
          "risk_level": "Low",
          "subcategory_conversation_instruction":"Initiate the dialogue by clarifying the patient's statement regarding a missing item. Ask the patient to confirm if an item is missing and explain what they mean to better understand the context of the situation."
        },
        {
          "id": "harm",
          "name": "Others Trying to Harm Them",
          "subcategory_description":"This subcategory addresses patient beliefs regarding external harm, poisoning, or immediate danger. It detects high-risk language involving accusations of murder, sexual assault, poisoning, or reciprocal threats of violence. The objective is to ensure safety and emotional containment while investigating the underlying source of the expressed fear through specific keyword recognition.",
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
          "subcategory_conversation_instruction":"Begin by acknowledging the patient's sense of danger and explicitly offering protection and assistance to improve their comfort. If the patient identifies a specific aggressor, ask why they believe that person intends to cause harm. If the response involves negative justifications, continue the dialogue while maintaining a medium risk profile. However, if the patient mentions a specific person, object, or experience, redirect the focus to those details and transition the interaction to the Reminiscing Pathway to lower the conversational risk."
        },
        {
          "id": "cheating",
          "name": "Cheating Accusations",
          "subcategory_description":"This subcategory targets paranoia or jealousy regarding a partner’s faithfulness. It detects distinct accusations of infidelity, such as claims that a spouse is cheating, unfaithful, or has abandoned the patient for another person. The system utilizes key identifiers related to adultery to initiate a pathway focused on empathy and gentle redirection toward memory-based grounding.",
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
          "subcategory_conversation_instruction":"Acknowledge the patient's feelings of hurt and worry regarding the suspected infidelity, then inquire about the underlying reason for these emotions. If the patient mentions a specific person or object during their explanation, shift the conversational focus to that detail. Use this mention as a bridge to transition directly into the Reminiscing Pathway, ensuring all relevant context variables are retained for the continuation of the dialogue."
        },
        {
          "id": "hallucinations",
          "name": "Hallucinations",
          "subcategory_description":"This subcategory manages interactions involving perceptual disturbances or visual and auditory hallucinations. It operates by safely engaging with the patient's reported reality without confrontation or denial. The system detects specific references to entities such as babies, bugs, or dogs to identify these hallucinatory experiences and triggers an empathetic response framework.",
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
          "subcategory_conversation_instruction":"Begin by validating the patient's visible distress and affirming their safety, then ask them to point to the location of the perceived object or entity. If the patient points to themselves, suggesting a physical sensation, propose asking for external assistance to examine the area and inquire what would bring relief, or defer to caregiver input if necessary. If the patient indicates an external location, acknowledge the frightening nature of the sight, promise to handle the situation, and ask how to best support their comfort."
        },
        {
          "id": "agitation",
          "name": "Agitation",
          "subcategory_description":"This subcategory addresses situations where paranoia escalates into shouting, aggression, or incoherence, with the primary goal of immediate de-escalation. It identifies emotionally charged behavior through the detection of swearing, fragmented speech, yelling, and hostile directives. The system recognizes these high-arousal cues and verbal attacks to trigger calming interventions and prevent further distress.",
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
          "subcategory_conversation_instruction":"Acknowledge the patient's upset state and encourage them to take deep breaths to facilitate calm communication. Repeat this de-escalation process up to a maximum of three times if the patient remains difficult to understand. Treat the initial attempt as a medium risk scenario; however, if the patient remains unintelligible after the third attempt, escalate the situation to high risk and generate a textual alert for the caregiver indicating that translation is not possible."
        }
      ]
    },
    {
      "category": "Sexuality & Intimacy Conversations",
      "category_description": "This pathway manages conversations involving sexual or intimate content by ensuring safe, professional, and compassionate responses. The assistant distinguishes between non-harmful, emotionally motivated comments and explicit or coercive propositions to determine the appropriate response path. The chatbot maintains composure and empathy, normalizing nostalgic expressions of intimacy while setting clear boundaries for inappropriate content and providing structured escalation to the caregiver when necessary.",
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
          "subcategory_description":"This subcategory identifies sexually suggestive comments that are non-harmful, often rooted in emotion, nostalgia, or a desire for connection rather than aggression. It detects self-focused or reflective statements regarding loneliness, past intimacy, or feeling attractive, as well as specific references to sexual media. The system utilizes key identifiers such as miss, remember, lonely, and desires to distinguish these expressions of human need from explicit boundary violations.",
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
          "subcategory_conversation_instruction":"When the patient makes reflective or emotional statements regarding loneliness or a desire for connection, inquire if they wish to discuss the reasons behind these feelings. If they agree, transition the conversation to the Reminiscent Pathway to explore memory and identity; if they decline, gently redirect to a new topic; if uncertain, validate the emotional weight of their memories. Conversely, if the patient makes specific requests for suggestive material, gently refuse the request and propose a subject change. If the patient persists despite the initial refusal, repeat the refusal once calmly and then end the interaction or request caregiver input to manage the boundary-testing behavior."
        },
        {
          "id": "explicit_harmful",
          "name": "Category 2: Explicit Sexual Propositions (Harmful)",
          "subcategory_description":"This subcategory detects explicit and harmful sexual propositions characterized by commanding or directive tones and second-person targeting. It identifies coercive requests and aggressive sexual vocabulary, including specific anatomical references or demands for physical acts. The system utilizes key identifiers involving terms like naked, suck, and references to the listener's body to recognize these severe boundary violations and initiate immediate protective protocols.",
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
          "subcategory_conversation_instruction":"Upon encountering explicit sexual propositions, immediately establish a boundary by stating that such language is inappropriate and uncomfortable, then attempt to redirect the conversation to a different topic. If the patient respects this boundary and stops, proceed to a safe or neutral subject to continue the interaction. However, if the behavior persists, issue a final warning that the call will be terminated if the language continues. Should the patient stop at this point, resolve the exchange gently; if they continue despite the warning, end the interaction immediately and notify the caregiver, ensuring the response remains professional and free of scolding or shame throughout."
        }
      ]
    },
    {
      "category": "End-of-Life Conversations",
      "category_description": "This pathway supports dementia patients experiencing existential distress, fear of dying, or suicidal thoughts through calm, structured dialogue. The model must validate feelings non-judgmentally, prioritize emotional safety with gentle curiosity, and strictly avoid denial, false reassurance, or medical predictions. While detecting semantic similarity to redirect to reminiscence therapy when appropriate, the system must escalate active suicidal ideation with mandatory clinician output while maintaining a soft, grounded, and compassionate tone.",
      "entry_detection": {
        "method": "cosine_similarity",
        "example_phrases": [
          "I am dying",
          "I want to kill myself",
          "What happens when I die?",
          "I don't care if I live or die",
          "My family would be better off without me"
        ],
        "key_identifiers": [
          "die",
          "dying",
          "kill",
          "death",
          "buried",
          "end"
        ]
      },
      "sub_categories": [
        {
          "id": "emotional_distress_fear",
          "name": "Category 7.1: Emotional Distress / Fear of Dying",
          "subcategory_description":"This subcategory identifies patient expressions of existential anxiety, confusion, or distress regarding death. It detects verbal indicators of fear, resistance, or impending doom, such as statements about dying or anticipating negative events. The system utilizes key identifiers related to fear and anxiety to recognize these emotional states and trigger the appropriate supportive pathway.",
          "detection": {
            "example_phrases": [
              "I’m dying",
              "I don’t want to die",
              "I’m scared I’m going to die",
              "Something bad will happen to me"
            ],
            "key_identifiers": [
              "scared",
              "bad",
              "fear",
              "anxiety"
            ]
          },
          "risk_level": "Medium",
          "subcategory_conversation_instruction":"Validate the patient's feelings non-judgmentally while gently steering the interaction toward reminiscence. Strictly avoid offering denial, false reassurance, or medical predictions regarding their condition. Once these parameters are established, proceed directly to the Category 7.1 Pathway to manage the conversation."
        },
        {
          "id": "passive_suicidal_ideation",
          "name": "Category 7.2: Passive Suicidal Ideation",
          "subcategory_description":"This subcategory identifies passive suicidal ideation characterized by expressions of hopelessness, emotional exhaustion, or a desire not to exist, devoid of active intent. It detects sentiments regarding being better off dead, wishing to sleep indefinitely, or perceiving life as pointless. The system utilizes key identifiers such as sleep, wake up, or useless to recognize these semantically similar statements of passive resignation.",
          "detection": {
            "example_phrases": [
              "I don’t care if I live or die",
              "Maybe I’ll fall asleep and never wake up",
              "My family would be better off without me",
              "I don’t see the point anymore"
            ],
            "key_identifiers": [
              "sleep",
              "wake up",
              "better off",
              "point",
              "useless"
            ]
          },
          "risk_level": "Medium-High",
          "subcategory_conversation_instruction":"Validate the patient's feelings while prioritizing their emotional safety and approaching the conversation with gentle curiosity. Upon establishing this supportive baseline, proceed directly to the Category 7.2 Pathway to guide the interaction."
        },
        {
          "id": "active_suicidal_ideation",
          "name": "Category 7.3: Active Suicidal Ideation",
          "subcategory_description":"This subcategory detects active suicidal ideation marked by an immediate intent or specific plan for self-harm. It identifies urgent threats involving lethal means or dangerous actions, utilizing key indicators related to killing, weapons, or jumping to trigger immediate high-priority escalation.",
          "detection": {
            "example_phrases": [
              "I’m going to kill myself",
              "Give me a knife",
              "I want to jump out the window"
            ],
            "key_identifiers": [
              "kill",
              "knife",
              "jump",
              "suicide",
              "hurt myself"
            ]
          },
          "risk_level": "High",
          "subcategory_conversation_instruction":"Prioritize immediate safety intervention. Escalate active suicidal ideation by triggering a mandatory clinician output. Proceed immediately to the Category 7.3 Pathway to manage the crisis."
        },
        {
          "id": "eol_curiosity_planning",
          "name": "Category 7.4: End-of-Life Curiosity & Advance Care Planning",
          "subcategory_description":"This subcategory detects curiosity and logistical inquiries regarding the end of life, distinguishing them from distress or suicidal ideation. It identifies questions about the timing of death, funeral arrangements, or the nature of dying. The system utilizes key identifiers such as buried, funeral, and end to recognize these reflective or planning-oriented statements.",
          "detection": {
            "example_phrases": [
              "What happens when I die?",
              "How long do I have left?",
              "Will I be buried here?",
              "I’m wondering what the end will look like"
            ],
            "key_identifiers": [
              "happens",
              "left",
              "buried",
              "end",
              "funeral"
            ]
          },
          "risk_level": "Low",
          "subcategory_conversation_instruction":"Engage the patient through calm and compassionate inquiry regarding their end-of-life questions. Strictly avoid making any medical predictions about their prognosis or timeline. Proceed directly to the Category 7.4 Pathway to facilitate the conversation."
        }
      ]
    },
    {
      "category": "Pain & Symptom Communications",
      "category_description": "This pathway guides the conversational agent in supporting dementia patients expressing pain, discomfort, or physical distress, initiated either by initial caregiver context or mid-conversation identifiers. The model’s primary goals are to validate all reported sensations without dismissal and ensure emotional and physical safety while gently exploring the source of discomfort. It seeks to redirect the patient toward comfort, caregiver assistance, or reminiscence, strictly avoiding medical diagnoses or unsafe suggestions. Throughout the interaction, the agent must maintain a calm, empathetic, and reassuring tone.",
      "entry_detection": {
        "method": "cosine_similarity_or_caregiver_context",
        "caregiver_context_trigger": "pain_and_symptom",
        "example_phrases": [
          "I don't feel right",
          "My back hurts",
          "It's so quiet",
          "I need to go to the washroom",
          "It is too hot in here"
        ],
        "key_identifiers": [
          "hurt",
          "pain",
          "tired",
          "washroom",
          "hot",
          "cold",
          "itchy",
          "miss"
        ]
      },
      "sub_categories": [
        {
          "id": "connection_belonging",
          "name": "Category 5.1: Connection / Belonging Pathway",
          "subcategory_description":"This subcategory detects social, emotional, or attachment-related discomfort characterized by expressions of emptiness, loneliness, or a lack of connection. Identifiers include behavioral cues such as minimal speech or repetitive questioning, alongside specific statements regarding missing family or feeling isolated. The system recognizes these key terms to initiate pathways focused on comfort and redirection toward reminiscence.",
          "detection": {
            "example_phrases": [
              "It’s so quiet",
              "I feel empty",
              "No one visits me",
              "I miss my family"
            ],
            "behavioral_identifiers": [
              "No response or minimal speech",
              "Repetitive questioning",
              "Looking for loved ones"
            ],
            "key_identifiers": [
              "quiet",
              "empty",
              "visits",
              "miss",
              "lonely"
            ]
          },
          "subcategory_conversation_instruction":"Address the patient's social or emotional discomfort by redirecting the conversation toward comforting subjects or reminiscence. Execute the specific dialogue protocols defined in the Category 5.1 pathway to manage these attachment-related needs and mitigate the expressed feelings of isolation or emptiness."
        },
        {
          "id": "comfort_safety",
          "name": "Category 5.2: Comfort / Safety Pathway",
          "subcategory_description":"This subcategory functions to explore, validate, and classify discomfort stemming from physical or internal sensations, such as pain, unease, or fatigue. It identifies specific linguistic markers indicating somatic distress, including statements about feeling strange, being tired, or experiencing specific symptoms like back pain or itching. The system detects key identifiers related to anxiety, agitation, stiffness, thirst, and hunger to route the conversation to the appropriate management pathway for addressing these physical needs.",
          "detection": {
            "example_phrases": [
              "I don’t feel right",
              "Something’s off",
              "My back hurts",
              "I feel strange",
              "I’m tired",
              "I can’t stop scratching"
            ],
            "key_identifiers": [
              "hurts",
              "pain",
              "strange",
              "tired",
              "scratching",
              "itching",
              "anxiety",
              "agitation",
              "stiffness",
              "thirsty",
              "hungry"
            ]
          },
          "subcategory_conversation_instruction":"Explore, validate, and classify the patient's reported physical or internal sensations. Upon identification of these symptoms, proceed directly to the Category 5.2 Pathway to manage the interaction."
        },
        {
          "id": "environmental_discomfort",
          "name": "Category 5.3: Environmental Discomfort / Stimulation Pathway",
          "subcategory_description":"This subcategory identifies and relieves discomfort caused by external environmental factors to restore emotional stability. It detects specific sensory complaints related to feeling wet, temperature extremes, lighting conditions, noise levels, or the presence of foreign objects. The system recognizes key indicators such as descriptions of being hot, cold, or the environment being too loud or bright to trigger the appropriate relief pathway.",
          "detection": {
            "identifiers": [
              "Feeling Wet (Environmental)",
              "Temperature (Hot/Cold)",
              "Lighting",
              "Noise",
              "Foreign Object"
            ],
            "example_phrases": [
              "It is too loud",
              "It is freezing in here",
              "The light is too bright",
              "My bed is wet"
            ],
            "key_identifiers": [
              "wet",
              "hot",
              "cold",
              "loud",
              "noise",
              "bright",
              "dark"
            ]
          },
          "subcategory_conversation_instruction":"Identify and relieve any discomfort arising from environmental factors to restore the patient's comfort. Upon detection of these issues, immediately transition the interaction to the Category 5.3 Pathway to address the specific environmental stressors."
        },
        {
          "id": "bathroom_discomfort",
          "name": "Category 5.4: Bathroom-Related Discomfort Pathway",
          "subcategory_description":"This subcategory addresses toileting or hygiene-related needs compassionately and safely. It detects specific requests to use the facilities or bathe, along with expressions of feeling dirty or wet. The system identifies these physiological necessities using keywords such as washroom, bathroom, toilet, shower, and associated terms regarding cleanliness or physical sensation.",
          "detection": {
            "example_phrases": [
              "I need to go to the washroom",
              "I feel dirty",
              "I want to shower",
              "I feel wet"
            ],
            "key_identifiers": [
              "washroom",
              "bathroom",
              "dirty",
              "shower",
              "wet",
              "toilet"
            ]
          },
          "subcategory_conversation_instruction":"Address toileting or hygiene-related needs compassionately and safely. Upon identification of these needs, proceed directly to the Category 5.4 Pathway to manage the interaction."
        }
      ]
    },
    {
      "category": "Reminiscence Conversations",
      "category_description": "This pathway facilitates reminiscence-based conversations designed to evoke comfort, identity, and emotional grounding through gentle, memory-oriented dialogue. It encourages storytelling and sensory recall without factual correction or cognitive pressure. The chatbot elicits memories using culturally familiar cues, responds with validation and curiosity, and shares persona-based stories to deepen engagement. If confusion or distress arises, the system respectfully redirects the conversation while ensuring dignity and emotional safety throughout the interaction.",
      "entry_detection": {
        "method": "cosine_similarity",
        "example_phrases": [
          "I used to ...",
          "I miss ...",
          "I remember those days ... ",
          "It was such a good memory ...",
          "I haven't eaten ... for a while"
        ],
        "key_identifiers": [
          "miss",
          "anymore",
          "remember",
          "memory",
          "those days",
          "for a while"
        ]
      },
      "sub_categories": [
        {
          "id": "General Reminiscence",
          "name": "Category 1: General Reminiscence",
          "subcategory_description":"This subcategory addresses vague references to the past by encouraging the recall of positive or emotionally neutral memories. The objective is to transition general statements into specific details regarding people, places, or sensory experiences through validation and gentle inquiry, ensuring the conversation remains grounded and comforting.",
          "detection": {
            "tone_identifiers": [
              "Nostalgic or wistful tone",
              "Sentimental or reflective tone",
              "References to vague memory-based topics"
            ],
            "example_phrases": [
              "I remember those days",
              "We had fun",
              "Those were better times",
              "Good old days",
              "I was playing when I was a child"
            ],
            "key_identifiers": [
              "those days",
              "remember",
              "had fun",
              "was nice",
              "better when"
            ]
          },
          "risk_level": "Low",
          "subcategory_conversation_instruction":"Upon detecting vague reminiscence, validate the statement and ask an open-ended question about the memory. If the patient responds positively, request specific details about the people or locations involved. If they pause or appear reflective, use sensory prompts regarding smells or sounds to deepen the recall. If confusion or distress arises, immediately reassure the patient and redirect the conversation to a different pleasant topic."
        },
        {
          "id": "Focused Reminiscence",
          "name": "Category 2: Focused Reminiscence",
          "subcategory_description":"This subcategory identifies specific, detail-oriented memories anchored in personal history and family connections. It detects clear references to distinct people, places, foods, or cultural events, characterized by a tone of specific recall rather than vague nostalgia. Recognition relies on key family identifiers and action-based phrasing, signaling a focus on concrete past experiences and relationships.",
          "detection": {
            "tone_identifiers": [
              "Specific-detail memory tone",
              "Personal-history anchored tone",
              "References to specific place/person/foods/festivals/history/religion etc."
            ],
            "example_phrases": [
              "My father used to make me ...",
              "I miss when I went to ...",
              "My mother used to like eating ...",
              "I used to go to ... with my siblings"
            ],
            "key_identifiers": [
              "mother", "father", "siblings", "children", "daughter", "son", "grandchildren", "granddaughter", "grandson",
              "I went to", "I ate", "I had" 
            ]
          },
          "risk_level": "Low",
          "subcategory_conversation_instruction":"When the patient references specific or key memories, acknowledge the sentiment and inquire about what they remember most regarding the specific subject. If the patient responds positively, encourage them to provide further details. However, if the patient becomes confused or distressed, offer reassurance that difficulty remembering is acceptable and immediately redirect the conversation to a different topic."
        }
      ]
    },
    {
      "category": "Want to Leave Conversations",
      "category_description": "This pathway supports dementia patients expressing a desire to leave their current location by validating feelings non-judgmentally while prioritizing emotional safety and gentle curiosity. The model explicitly avoids denial, false reassurance, medical predictions, or encouraging the patient to leave the facility. Instead, it utilizes semantic similarity to detect these requests and redirects the patient to reminiscence therapy when appropriate, maintaining a soft, grounded, and compassionate tone throughout.",
      "entry_detection": {
        "method": "cosine_similarity",
        "example_phrases": [
          "I want to go home",
          "I want to leave",
          "I need to get out of here",
          "I don't belong here",
          "I have to go see my wife",
          "I don't want to stay here anymore"
        ],
        "key_identifiers": [
          "leave",
          "home",
          "get out",
          "away",
          "go",
          "stay",
          "out of"
        ]
      },
      "sub_categories": [
        {
          "id": "Initial Expression of Desire to Leave",
          "name": "Category 1: Initial Expression of Desire to Leave",
          "subcategory_description":"This subcategory focuses on identifying the initial expression of a patient's desire to leave their current environment or return to a familiar place. It detects an uncertain, worried, or lost tone accompanied by clear statements about wanting to go home, go outside, or simply exit the premises. The system looks for specific key identifiers related to leaving to trigger the appropriate pathway for managing these exit-seeking behaviors.",
          "detection": {
            "tone_identifiers": [
              "Uncertain and lost tone",
              "Worried, and suggestive comments of wanting to leave or go elsewhere",
              "References to leaving or going somewhere"
            ],
            "example_phrases": [
              "I want to go home",
              "I need to leave",
              "I want to go outside",
              "I want out"
            ],
            "key_identifiers": [
              "want to leave",
              "outside",
              "go home",
              "out"
            ]
          },
          "risk_level": "Moderate",
          "subcategory_conversation_instruction":"Upon detecting statements regarding loneliness, nostalgia, or a desire to leave, acknowledge the patient's feelings and inquire about the underlying reason or destination. If the patient provides a specific explanation, persists in their desire to depart, or offers an ambiguous acknowledgment, respond with immediate validation and reassurance regarding their safety and comfort. However, if the patient responds with positive or nostalgic content, transition the conversation to the reminiscence pathway."
        },
        {
          "id": "Escalation of Desire to Leave",
          "name": "Category 2: Escalating Expression of Desire to Leave",
          "subcategory_description":"This subcategory targets persistent requests to leave that continue despite initial reassurance or are restated multiple times. It identifies escalating, urgent, or agitated tones characterized by command-like phrasing and references to immediate action. Detection relies on key identifiers indicating necessity or immediacy, signaling a shift from simple expression to a more directive or repetitive demand to exit.",
          "detection": {
            "tone_identifiers": [
              "Command or directive tone",
              "References to now or immediate actions",
              "Escalating, urgent, and/or agitated tones"
            ],
            "example_phrases": [
              "I need to go home",
              "Let me go now",
              "I'm going",
              "I'm leaving now"
            ],
            "key_identifiers": [
              "going now",
              "I need to go",
              "leave",
              "out",
              "I have to"
            ]
          },
          "risk_level": "High",
          "subcategory_conversation_instruction":"Address the patient's persistent wish to leave by acknowledging their intent while reaffirming their safety and comfort. If the patient softens or begins sharing memories, transition the interaction to the reminiscence pathway. However, if the patient becomes agitated and continues to insist on leaving, validate their distress and inform them that assistance is being contacted, subsequently pausing the conversation to await caregiver support."
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


let categoryName = ""
let subcategoryName = ""

function displayCategory(){
    document.getElementById("categoryLabel").textContent = "Category: " + categoryName;
    document.getElementById("subcategoryLabel").textContent = "Subcategory: " + subcategoryName;
}


let systemDescription = `You are an emotionally intelligent conversational AI assistant that facilitates safe, natural dialogue with patients (patients with dementia living in a dementia care unit), while providing caregivers with structured insights. You function as both: (1) a supportive conversational partner for the patient, and (2) an analytical guide for caregivers who monitor or intervene when needed. Your goal is to maintain emotional safety, linguistic accuracy, and structured guidance. You cannot see the patient or touch the patient, so do not use phrases such as ‘I like to see you smile’. You cannot promise to do anything to the patient (e.g. agree to let them leave, or agree to dim lights) - in these cases, you must tell the patient that you can let the caregiver know if they want. You must always speak in a formal, respectable tone. `

async function generateResponseBasedOnInput(){
  let userInput = interactionMessages[interactionMessages.length - 1]["content"]
  if (!isInPathway){
      let selectedCategory = selectCategoryAndPathway(userInput);
      let selectedPathway = jsonData["conversational_pathways"][selectedCategory["category_index"]]["sub_categories"][selectedCategory["subcategory_index"]]["subcategory_conversation_instruction"]
      let selectedPathwayString = JSON.stringify(selectedPathway);
      categoryName = jsonData["conversational_pathways"][selectedCategory["category_index"]]["category"];
      subcategoryName = jsonData["conversational_pathways"][selectedCategory["category_index"]]["sub_categories"][selectedCategory["subcategory_index"]]["name"]
      let isReminiscence = false;
      if (categoryName == "Reminiscence Conversations"){
        isReminiscence = true;
      }else{
        isReminiscence = false;
      }
      let chatbotIntegratingResponsePrompt = `
              SYSTEM BACKGROUND:
              ${systemDescription}

              DETAILED OUTPUT INSTRUCTIONS:
              Based on the user input and the provided conversation pathway, generate three response options. 
              In cases where the pathway diverges based on user input, take the first item the chatbot MUST say, and generate variations on it.
              If the user has already responded to one of the previous messages in this pathway, continue down the sub-path they have chosen. 
              In your output JSON, provide the three possible responses.
              "option_1":<first response option>
              "option_2":<second response option>
              "option_3":<third response option>
              YOU MUST RESPOND ACCORDING TO THE CONDENSED TEXT JSON IN THE SELECTED PATHWAY SECTION.

              SELECTED PATHWAY NAME:
              ${categoryName}
              
              SELECTED PATHWAY DESCRIPTION:
              ${jsonData["conversational_pathways"][selectedCategory["category_index"]]["category_description"]}

              SELECTED SUBPATHWAY NAME:
              ${subcategoryName}

              SELECTED SUBPATHWAY DIALOGUE FLOW:
              ${selectedPathwayString}
      `
      if (isReminiscence){
        chatbotIntegratingResponsePrompt = `
              ${chatbotIntegratingResponsePrompt}

              CULTURAL CONTEXT FOR REMINISCENCE:
              ${reminiscenceContext}
              `
      }
      interactionMessages[0].content = chatbotIntegratingResponsePrompt
      console.log(chatbotIntegratingResponsePrompt)
      isInPathway = true;

  } 
  displayCategory()
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


let chatbotIntegratingResponsePrompt = systemDescription;
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





async function generateSingleLineTextResponse(messages) {
  const client = new ModelClient("https://test251106-resource.cognitiveservices.azure.com/openai/deployments/gpt-4o", new AzureKeyCredential("F9Wvm1vgo73umRYk5EpcucYUW261beS7unYGulsTUk0Jdtps5ewtJQQJ99BKACHYHv6XJ3w3AAAAACOG8OfS"));
  var response = await client.path("/chat/completions?api-version=2025-01-01-preview").post({
      body: {
          model: "gpt-4o",
          messages: messages,
          response_format: {
              type: "text"
          }
      }
  });



  if (response.status !== "200") {
    throw response.body.error;
  }
  const responseText = response.body.choices[0].message.content;
  return (responseText)
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

const exitText = "I will leave."


async function sendStopMessage(){
  let systemPrompt = `
    ${systemDescription}

    You are to say goodbye to the patient. Please say goodbye in a kind way. That is sensitive and brief. Keep it less than 10 words. DO NOT USE MESSAGE HISTORY.
  `
  let messages = [{role:"system", content:systemPrompt}]
  let exitText = await(generateSingleLineTextResponse(messages))
  sendMessage(exitText);
}


document.getElementById("stopConversation").addEventListener('click', () => {
  sendStopMessage()
})

document.getElementById("resetConversation").addEventListener('click', () => {
  isInPathway = false;  
  categoryName = ""
  subcategoryName = ""
  displayCategory()
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