import Config from "./Config.js";
import Light from "./light.js";
import Speech from "speak-tts";
import EventEmitter from "@onemorestudio/eventemitterjs";
export default class Chat extends EventEmitter {
  constructor(scene) {
    super();
    this.API_URL = "https://api.openai.com/v1/chat/completions";
    this.API_KEY = Config.OPEN_AI_KEY;
    this.messages = [];
    this.light = new Light(scene);
    this.context =
      "Crée une histoire avec moi qui se passe dans un environnement montagneux avec de la neige et des sapins. Pour écrire cette histoire nous allons parler à tour de role. Tu vas me poser des questions puis, attendre ma réponse. ENSUITE, tu vas écrire une phrase après chacune de mes réponses. EN TOUT, TU DOIS SEULEMENT me POSER 5 QUESTIONS OBLIGATOIREMENT ! et pas une de plus. Je t'en supplie. D’abord tu vas me demander à quoi ressemble le personnage principal ? Tu vas me laisser répondre à ta question. Et après que tu aies reçu ma réponse, tu vas écrire une phrase qui correspondra à la situation initale de l’histoire, en une phrase seulement. Ensuite, tu vas me poser une question en lien avec l’élément perturbateur de l’histoire en une phrase. Tu vas me laisser répondre à ta question. Puis, tu vas développer l’élément perturbateur par rapport à ma réponse en une phrase. Ensuite, tu vas me poser une question qui t’aidera à développer les péripéties en une phrase. Tu vas me laisser répondre à ta question. Puis, tu vas écrire un bout de l’histoire qui sera en lien avec les péripéties de l’histoire. Tu vas ensuite me poser une question en lien avec l’élément de résolution de l’histoire. Tu vas me laisser répondre à ta question. Finalement, tu vas écrire la situation finale et conclure l’histoire. Tu dois résumer toute l’histoire qu’on a inventé depuis le début et dire finalement le mot: FIN.  Tu dois t’exprimer comme un auteur de conte de fée qui aime les histoire mignonnes, mais qui finisse mal, avec du sang et de la tragédie. Tu ne dois pas dire qui tu es dans notre conversation.";

    this.speech = new Speech(); // will throw an exception if not browser supported
    if (this.speech.hasBrowserSupport()) {
      // returns a boolean
      console.log("speech synthesis supported");
    }
    this.speech
      .init({
        volume: 1,
        lang: "fr-CH",
        rate: 0.4,
        pitch: 2,
        voice: "Microsoft Guillaume - French (Switzerland)",
        //voice: "Thomas",

        splitSentences: true,
        listeners: {
          onvoiceschanged: (voices) => {
            console.log("Event voiceschanged", voices);
          },
        },
      })
      .then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data);
        // this.speech.voice = "Eddy (anglais (États-Unis))";
      })
      .then(() => {
        console.log("Success !");
        //
        // this.call(this.context);
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });

    // this.init();
  }
  async init() {
    // on invente un contexte pour le chat
  }

  async call(userMessage) {
    this.messages.push({
      role: "user",
      content: userMessage,
    });
    console.log("config", Config.TEXT_MODEL);
    try {
      console.log("Send message to OpenAI API");
      // Fetch the response from the OpenAI API with the signal from AbortController
      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          model: Config.TEXT_MODEL, // "gpt-3.5-turbo",
          messages: this.messages,
        }),
      });

      const data = await response.json();
      const responseContent = data.choices[0].message.content;

      const isTargetWordPresent = this.isWordPresent(responseContent);
      this.emit("gpt_response", [responseContent]);

      if (isTargetWordPresent != "") {
        this.emit("wordFound", [isTargetWordPresent]);

        // Changez la couleur de la lumière lorsque le mot "film" est trouvé
      } else {
        console.log(
          `Le mot "${responseContent}" n'a pas été trouvé dans la réponse.`
        );
      }
      // ici on attends la réponse de CHAT GPT
      console.log(data.choices[0].message.content);

      // on peut envoyer la réponse à l'app dans l'idée de voir si on pourrait générer une image
      // this.emit("gpt_response", [data.choices[0].message.content]);
      this.activeString = "";
      //on peut faire parler le bot
      this.speech
        .speak({
          text: data.choices[0].message.content,
          listeners: {
            onstart: () => {
              // console.log("Start utterance");
            },
            onend: () => {
              // console.log("End utterance");
            },
            onresume: () => {
              // console.log("Resume utterance");
            },
            onboundary: (event) => {
              this.extractWord(event);
            },
          },
        })
        .then(() => {
          // console.log("This is the end my friend!");
          this.emit("speechEnd", [data]);
        });
    } catch (error) {
      console.error("Error:", error);
      resultText.innerText = "Error occurred while generating.";
    }
  }

  isWordPresent(text) {
    if (typeof text == "string") {
      const arrayTarget = ["fin"];

      const lowerCaseText = text.toLowerCase();

      for (let i = 0; i < arrayTarget.length; i++) {
        const isInside = lowerCaseText.includes(arrayTarget[i]);
        if (isInside) {
          return arrayTarget[i];
        }
      }
      return "";
    }
  }

  extractWord(event) {
    const index = event.charIndex;
    const word = this.getWordAt(event.target.text, index);
    this.emit("word", [word]);
  }

  // Get the word of a string given the string and index
  getWordAt(str, pos) {
    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    let left = str.slice(0, pos + 1).search(/\S+$/);
    let right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      return str.slice(left);
    }

    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);
  }
}
